"""
Регистрация и вход пользователей с проверкой возраста 18+.
"""
import json
import os
import hashlib
import secrets
from datetime import date
import psycopg2

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
    'Content-Type': 'application/json',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    action = (event.get('queryStringParameters') or {}).get('action', '')
    body = json.loads(event.get('body') or '{}')

    # Регистрация
    if action == 'register':
        email = body.get('email', '').strip().lower()
        password = body.get('password', '')
        birth_date_str = body.get('birth_date', '')

        if not email or not password or not birth_date_str:
            return {'statusCode': 400, 'headers': CORS_HEADERS,
                    'body': json.dumps({'error': 'Заполните все поля'})}

        birth_date = date.fromisoformat(birth_date_str)
        today = date.today()
        age = (today - birth_date).days // 365

        if age < 18:
            return {'statusCode': 403, 'headers': CORS_HEADERS,
                    'body': json.dumps({'error': 'Доступ разрешён только с 18 лет'})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute('SELECT id FROM users WHERE email = %s', (email,))
        if cur.fetchone():
            conn.close()
            return {'statusCode': 409, 'headers': CORS_HEADERS,
                    'body': json.dumps({'error': 'Email уже зарегистрирован'})}

        pw_hash = hash_password(password)
        cur.execute(
            'INSERT INTO users (email, password_hash, birth_date) VALUES (%s, %s, %s) RETURNING id',
            (email, pw_hash, birth_date_str)
        )
        user_id = cur.fetchone()[0]
        token = secrets.token_hex(32)
        cur.execute(
            'INSERT INTO sessions (user_id, token) VALUES (%s, %s)',
            (user_id, token)
        )
        conn.commit()
        conn.close()

        return {'statusCode': 200, 'headers': CORS_HEADERS,
                'body': json.dumps({'token': token, 'email': email})}

    # Вход
    if action == 'login':
        email = body.get('email', '').strip().lower()
        password = body.get('password', '')

        if not email or not password:
            return {'statusCode': 400, 'headers': CORS_HEADERS,
                    'body': json.dumps({'error': 'Введите email и пароль'})}

        conn = get_conn()
        cur = conn.cursor()
        pw_hash = hash_password(password)
        cur.execute(
            'SELECT id, email FROM users WHERE email = %s AND password_hash = %s',
            (email, pw_hash)
        )
        user = cur.fetchone()
        if not user:
            conn.close()
            return {'statusCode': 401, 'headers': CORS_HEADERS,
                    'body': json.dumps({'error': 'Неверный email или пароль'})}

        token = secrets.token_hex(32)
        cur.execute('INSERT INTO sessions (user_id, token) VALUES (%s, %s)', (user[0], token))
        conn.commit()
        conn.close()

        return {'statusCode': 200, 'headers': CORS_HEADERS,
                'body': json.dumps({'token': token, 'email': user[1]})}

    # Проверка токена
    if action == 'verify':
        token = event.get('headers', {}).get('X-Session-Token', '')
        if not token:
            return {'statusCode': 401, 'headers': CORS_HEADERS,
                    'body': json.dumps({'error': 'Нет токена'})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            'SELECT u.email FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = %s AND s.expires_at > NOW()',
            (token,)
        )
        row = cur.fetchone()
        conn.close()

        if not row:
            return {'statusCode': 401, 'headers': CORS_HEADERS,
                    'body': json.dumps({'error': 'Сессия истекла'})}

        return {'statusCode': 200, 'headers': CORS_HEADERS,
                'body': json.dumps({'email': row[0]})}

    return {'statusCode': 404, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Not found'})}