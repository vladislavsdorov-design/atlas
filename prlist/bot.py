# import logging
# import requests
# import os
# from datetime import datetime
# from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
# import json
# import time
# import random

# # Токен бота
# TOKEN = "8560281750:AAHJM-Vgo6E6qDZyuqXpBrsNTqPseHO3sNs"
# API_URL = f"https://api.telegram.org/bot{TOKEN}"

# # Настройка логирования
# logging.basicConfig(
#     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
#     level=logging.INFO
# )
# logger = logging.getLogger(__name__)

# # Папка для временного хранения фото
# if not os.path.exists('photos'):
#     os.makedirs('photos')

# # Словарь для хранения данных пользователя
# user_data = {}

# # Цветовая палитра Rick Owens для чека
# COLORS = {
#     'background': '#000000',  # Чистый черный как в чеках
#     'paper': '#111111',  # Немного светлее для эффекта бумаги
#     'text_primary': '#dddddd',  # Светло-серый для основного текста
#     'text_secondary': '#777777',  # Темно-серый для второстепенного
#     'accent': '#aa5500',  # Темно-коричневый для акцентов
#     'border': '#333333',  # Линии как на чеке
#     'perforation': '#444444',  # Пунктир для перфорации
#     'stamp': '#8B4513'  # Цвет штампа
# }

# def send_message(chat_id, text, parse_mode='Markdown', keyboard=None):
#     """Отправка сообщения"""
#     url = f"{API_URL}/sendMessage"
#     data = {
#         'chat_id': chat_id,
#         'text': text,
#         'parse_mode': parse_mode
#     }
#     if keyboard:
#         data['reply_markup'] = json.dumps(keyboard)
    
#     try:
#         requests.post(url, json=data)
#     except Exception as e:
#         logger.error(f"Ошибка отправки сообщения: {e}")

# def send_photo(chat_id, photo_path, caption=''):
#     """Отправка фото"""
#     url = f"{API_URL}/sendPhoto"
    
#     try:
#         with open(photo_path, 'rb') as photo:
#             files = {'photo': photo}
#             data = {'chat_id': chat_id, 'caption': caption}
#             requests.post(url, data=data, files=files)
#     except Exception as e:
#         logger.error(f"Ошибка отправки фото: {e}")

# def handle_updates():
#     """Обработка обновлений"""
#     last_update_id = 0
    
#     print("🤖 Бот запущен в стиле Rick Owens (Receipt Style)...")
#     print("📱 Используется простой метод (совместим с Python 3.13)")
#     print("🧾 Стиль: КАССОВЫЙ ЧЕК")
    
#     while True:
#         try:
#             # Получаем обновления
#             url = f"{API_URL}/getUpdates"
#             params = {'offset': last_update_id + 1, 'timeout': 30}
#             response = requests.get(url, params=params, timeout=35)
            
#             if response.status_code == 200:
#                 updates = response.json().get('result', [])
                
#                 for update in updates:
#                     last_update_id = update['update_id']
#                     process_update(update)
            
#             time.sleep(1)
            
#         except KeyboardInterrupt:
#             print("\n👋 Бот остановлен")
#             break
#         except Exception as e:
#             logger.error(f"Ошибка в цикле обновлений: {e}")
#             time.sleep(5)

# def process_update(update):
#     """Обработка одного обновления"""
#     try:
#         # Обработка сообщений
#         if 'message' in update:
#             message = update['message']
#             chat_id = message['chat']['id']
#             user_id = message['from']['id']
            
#             # Команда /start
#             if 'text' in message and message['text'] == '/start':
#                 welcome_text = """
# ╔══════════════════════════╗
# ║  ⚡️ *ATLAS* ⚡️  ║
# ║  RICK OWENS ESTHETIC  ║
# ╚══════════════════════════╝

# Добро пожаловать в генератор 
# премиальных прайс-листов.

# _• Грубая элегантность_
# _• Минимализм_
# _• Темная эстетика_
# _• Стиль кассового чека_

# Команды:
# /new - начать создание
# /help - инструкция
#                 """
#                 keyboard = {
#                     'inline_keyboard': [
#                         [{'text': '📸 НАЧАТЬ СОЗДАНИЕ', 'callback_data': 'new_price'}],
#                         [{'text': '❓ ИНСТРУКЦИЯ', 'callback_data': 'help'}],
#                         [{'text': '🎨 ПРИМЕР СТИЛЯ', 'callback_data': 'example'}]
#                     ]
#                 }
#                 send_message(chat_id, welcome_text, keyboard=keyboard)
            
#             # Команда /help
#             elif 'text' in message and message['text'] == '/help':
#                 help_text = """
# ╔══════════════════════════╗
# ║        *ИНСТРУКЦИЯ*        ║
# ╚══════════════════════════╝

# 1. /new - начать создание
# 2. Загрузите фото товара
# 3. После фото укажите:
#    • Название
#    • Цену
#    • Описание
# 4. /generate - создать чек

# *Формат:* как на кассовом чеке
# *Стиль:* Rick Owens
#                 """
#                 send_message(chat_id, help_text)
            
#             # Команда /new
#             elif 'text' in message and message['text'] == '/new':
#                 user_data[user_id] = {
#                     'photos': [],
#                     'items': [],
#                     'current_photo': None,
#                     'chat_id': chat_id
#                 }
#                 send_message(chat_id, 
#                     "╔══════════════════════════╗\n"
#                     "║  🖤 *НОВЫЙ ЧЕК* 🖤  ║\n"
#                     "╚══════════════════════════╝\n\n"
#                     "Отправляйте фотографии товаров.\n"
#                     "После каждой фото укажите:\n"
#                     "┌────────────────────┐\n"
#                     "│ Название товара    │\n"
#                     "│ Цена               │\n"
#                     "│ Описание           │\n"
#                     "└────────────────────┘"
#                 )
            
#             # Команда /generate
#             elif 'text' in message and message['text'] == '/generate':
#                 if user_id in user_data and user_data[user_id]['items']:
#                     send_message(chat_id, "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n🖨️ *ПЕЧАТАЮ ЧЕК...*\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯")
#                     generate_and_send(user_id)
#                 else:
#                     send_message(chat_id, "❌ Нет данных. Используйте /new")
            
#             # Обработка фото
#             elif 'photo' in message:
#                 if user_id not in user_data:
#                     send_message(chat_id, "Сначала используйте /new")
#                     return
                
#                 if len(user_data[user_id]['photos']) >= 10:
#                     send_message(chat_id, "Лимит фото (10). Используйте /generate")
#                     return
                
#                 # Получаем фото
#                 photo = message['photo'][-1]
#                 file_id = photo['file_id']
                
#                 # Получаем путь к файлу
#                 file_url = f"{API_URL}/getFile"
#                 file_response = requests.get(file_url, params={'file_id': file_id})
                
#                 if file_response.status_code == 200:
#                     file_path = file_response.json()['result']['file_path']
#                     download_url = f"https://api.telegram.org/file/bot{TOKEN}/{file_path}"
                    
#                     # Скачиваем фото
#                     timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
#                     photo_path = f"photos/photo_{user_id}_{timestamp}.jpg"
                    
#                     img_response = requests.get(download_url)
#                     with open(photo_path, 'wb') as f:
#                         f.write(img_response.content)
                    
#                     user_data[user_id]['photos'].append(photo_path)
#                     user_data[user_id]['current_photo'] = photo_path
                    
#                     send_message(chat_id, 
#                         f"┌────────────────────┐\n"
#                         f"│ ✅ Фото {len(user_data[user_id]['photos'])} загружено │\n"
#                         f"└────────────────────┘\n\n"
#                         "Теперь отправьте информацию:\n"
#                         "```\nНазвание товара\nЦена\nОписание\n```"
#                     )
            
#             # Обработка текста (информация о товаре)
#             elif 'text' in message:
#                 if user_id in user_data and user_data[user_id].get('current_photo'):
#                     text = message['text']
#                     lines = text.split('\n')
                    
#                     if len(lines) >= 2:
#                         item_info = {
#                             'name': lines[0].strip(),
#                             'price': lines[1].strip(),
#                             'description': lines[2].strip() if len(lines) > 2 else '',
#                             'photo': user_data[user_id]['current_photo']
#                         }
                        
#                         user_data[user_id]['items'].append(item_info)
#                         user_data[user_id]['current_photo'] = None
                        
#                         send_message(chat_id,
#                             f"┌────────────────────┐\n"
#                             f"│ ✅ {item_info['name'][:15]} │\n"
#                             f"│    {item_info['price']}        │\n"
#                             f"└────────────────────┘\n\n"
#                             f"Загружено: {len(user_data[user_id]['items'])} товаров\n"
#                             "Продолжайте или /generate"
#                         )
#                     else:
#                         send_message(chat_id, 
#                             "❌ Неверный формат. Используйте:\n"
#                             "```\nНазвание\nЦена\nОписание\n```"
#                         )
        
#         # Обработка callback-запросов (кнопки)
#         elif 'callback_query' in update:
#             callback = update['callback_query']
#             chat_id = callback['message']['chat']['id']
#             data = callback['data']
#             user_id = callback['from']['id']
            
#             # Отвечаем на callback
#             requests.post(f"{API_URL}/answerCallbackQuery", 
#                          json={'callback_query_id': callback['id']})
            
#             if data == 'new_price':
#                 # Создаем искусственное сообщение с командой /new
#                 user_data[user_id] = {
#                     'photos': [],
#                     'items': [],
#                     'current_photo': None,
#                     'chat_id': chat_id
#                 }
#                 send_message(chat_id, 
#                     "╔══════════════════════════╗\n"
#                     "║  🖤 *НОВЫЙ ЧЕК* 🖤  ║\n"
#                     "╚══════════════════════════╝\n\n"
#                     "Отправляйте фотографии товаров."
#                 )
#             elif data == 'help':
#                 help_text = """
# ╔══════════════════════════╗
# ║        *ИНСТРУКЦИЯ*        ║
# ╚══════════════════════════╝

# 1. Загрузите фото
# 2. Опишите товар
# 3. /generate - готово
#                 """
#                 send_message(chat_id, help_text)
#             elif data == 'example':
#                 send_message(chat_id, 
#                     "🎨 *СТИЛЬ ЧЕКА RICK OWENS*\n\n"
#                     "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n"
#                     "ATLAS\n"
#                     "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n"
#                     "• Черный фон\n"
#                     "• Белый текст\n"
#                     "• Линии как на чеке\n"
#                     "• Перфорация\n"
#                     "• Штампы\n"
#                     "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯"
#                 )
    
#     except Exception as e:
#         logger.error(f"Ошибка обработки обновления: {e}")

# def generate_and_send(user_id):
#     """Генерация и отправка прайс-листа в стиле чека"""
#     try:
#         if user_id not in user_data:
#             return
        
#         items = user_data[user_id]['items']
#         chat_id = user_data[user_id]['chat_id']
        
#         # Создаем изображение в стиле чека
#         img_width = 1000  # Уже, как чековая лента
#         img_height = 200 + (len(items) * 350)  # Высота зависит от количества товаров
#         margin = 40
        
#         # Создаем фон как у старой бумаги
#         collage = Image.new('RGB', (img_width, img_height), color=COLORS['background'])
#         draw = ImageDraw.Draw(collage)
        
#         # Добавляем эффект "старой бумаги" - легкий шум
#         for _ in range(500):
#             x = random.randint(0, img_width)
#             y = random.randint(0, img_height)
#             draw.point((x, y), fill=COLORS['border'])
        
#         # Шрифт
#         try:
#             font_title = ImageFont.truetype("arial.ttf", 48)
#             font_item = ImageFont.truetype("arial.ttf", 24)
#             font_price = ImageFont.truetype("arialbd.ttf", 30)
#             font_small = ImageFont.truetype("arial.ttf", 18)
#             font_mono = ImageFont.truetype("cour.ttf", 22)  # Моноширинный для чека
#         except:
#             font_title = ImageFont.load_default()
#             font_item = ImageFont.load_default()
#             font_price = ImageFont.load_default()
#             font_small = ImageFont.load_default()
#             font_mono = ImageFont.load_default()
        
#         # Верхняя перфорация (пунктирная линия)
#         y = 20
#         for x in range(20, img_width - 20, 15):
#             draw.rectangle([x, y, x + 5, y + 5], fill=COLORS['perforation'])
        
#         # Верхняя линия чека
#         draw.line([(margin, 50), (img_width - margin, 50)], 
#                   fill=COLORS['accent'], width=3)
        
#         # Логотип ATLAS в стиле чека
#         logo_text = ">> ATLAS <<"
#         draw.text((img_width // 2 - 100, 70), logo_text, 
#                  font=font_title, fill=COLORS['text_primary'])
        
#         # Линия под логотипом
#         draw.line([(margin, 140), (img_width - margin, 140)], 
#                   fill=COLORS['border'], width=2)
        
#         # Дата и время (как на чеке)
#         current_time = datetime.now().strftime("%d.%m.%Y  %H:%M")
#         draw.text((img_width - 200, 150), current_time, 
#                  font=font_small, fill=COLORS['text_secondary'])
        
#         # Заголовки колонок
#         draw.text((margin, 180), "ТОВАР", font=font_item, fill=COLORS['text_primary'])
#         draw.text((img_width - 150, 180), "ЦЕНА", font=font_item, fill=COLORS['text_primary'])
        
#         # Линия под заголовками
#         draw.line([(margin, 210), (img_width - margin, 210)], 
#                   fill=COLORS['border'], width=1)
        
#         y_position = 230
        
#         # Добавляем товары
#         total = 0
#         for i, item in enumerate(items):
#             # Фото товара (как маленький квадрат)
#             if os.path.exists(item['photo']):
#                 try:
#                     item_photo = Image.open(item['photo'])
#                     photo_size = 80
#                     item_photo.thumbnail((photo_size, photo_size))
                    
#                     # Добавляем рамку вокруг фото
#                     photo_with_border = Image.new('RGB', (photo_size + 4, photo_size + 4), COLORS['border'])
#                     photo_with_border.paste(item_photo, (2, 2))
                    
#                     collage.paste(photo_with_border, (margin, y_position))
#                 except:
#                     pass
            
#             # Название товара (обрезанное если длинное)
#             name = item['name'].upper()
#             if len(name) > 20:
#                 name = name[:18] + ".."
            
#             draw.text((margin + 100, y_position + 10), name, 
#                      font=font_mono, fill=COLORS['text_primary'])
            
#             # Цена
#             price = item['price']
#             draw.text((img_width - 150, y_position + 10), price, 
#                      font=font_price, fill=COLORS['accent'])
            
#             # Описание маленьким шрифтом
#             if item['description']:
#                 desc = item['description']
#                 if len(desc) > 30:
#                     desc = desc[:28] + ".."
#                 draw.text((margin + 100, y_position + 40), desc, 
#                          font=font_small, fill=COLORS['text_secondary'])
            
#             # Пунктирная линия между товарами
#             if i < len(items) - 1:
#                 y_line = y_position + 100
#                 for x in range(margin, img_width - margin, 20):
#                     draw.line([(x, y_line), (x + 10, y_line)], 
#                              fill=COLORS['perforation'], width=1)
            
#             # Пытаемся извлечь число из цены для подсчета суммы
#             try:
#                 price_num = float(''.join(c for c in price if c.isdigit() or c == '.'))
#                 total += price_num
#             except:
#                 pass
            
#             y_position += 120
        
#         # Линия перед итогом
#         y_position += 20
#         draw.line([(margin, y_position), (img_width - margin, y_position)], 
#                   fill=COLORS['border'], width=2)
        
#         # Итоговая сумма
#         y_position += 30
#         draw.text((margin, y_position), "ИТОГО:", font=font_price, fill=COLORS['text_primary'])
#         draw.text((img_width - 200, y_position), f"€{total:.2f}", 
#                  font=font_price, fill=COLORS['accent'])
        
#         # Нижняя часть чека
#         y_position += 60
        
#         # Штамп "ATLAS" (полупрозрачный)
#         stamp_text = "ATLAS"
#         for i in range(5):
#             alpha = 30
#             stamp_color = (*ImageColor.getrgb(COLORS['stamp']), alpha)
#             draw.text((img_width // 2 - 150 + i*10, y_position + i*5), 
#                      stamp_text, font=font_title, fill=stamp_color)
        
#         # Перфорация снизу
#         y_position += 80
#         for x in range(20, img_width - 20, 15):
#             draw.rectangle([x, y_position, x + 5, y_position + 5], 
#                           fill=COLORS['perforation'])
        
#         # Текст "СПАСИБО ЗА ПОКУПКУ"
#         thanks_text = "••• THANK YOU •••"
#         draw.text((img_width // 2 - 120, y_position + 20), thanks_text, 
#                  font=font_small, fill=COLORS['text_secondary'])
        
#         # Реквизиты в стиле Rick Owens
#         footer_text = "RICK OWENS ESTHETIC | ATLAS COLLECTION"
#         draw.text((img_width // 2 - 200, y_position + 50), footer_text, 
#                  font=font_small, fill=COLORS['text_secondary'])
        
#         # Сохраняем
#         output_path = f"receipt_{user_id}.jpg"
#         collage.save(output_path, quality=95)
        
#         # Отправляем
#         send_photo(chat_id, output_path, "🧾 *ВАШ ЧЕК ГОТОВ* 🧾\nСтиль: Rick Owens")
        
#         # Очищаем
#         cleanup_user_files(user_id)
#         if os.path.exists(output_path):
#             os.remove(output_path)
            
#     except Exception as e:
#         logger.error(f"Ошибка генерации: {e}")
#         send_message(chat_id, "❌ Ошибка создания чека")

# def cleanup_user_files(user_id):
#     """Очистка файлов"""
#     if user_id in user_data:
#         for item in user_data[user_id].get('items', []):
#             try:
#                 if 'photo' in item and os.path.exists(item['photo']):
#                     os.remove(item['photo'])
#             except:
#                 pass
        
#         for photo in user_data[user_id].get('photos', []):
#             try:
#                 if os.path.exists(photo):
#                     os.remove(photo)
#             except:
#                 pass
        
#         del user_data[user_id]

# # Добавляем импорт для цвета
# from PIL import ImageColor

# if __name__ == '__main__':
#     handle_updates()import requests
import requests
import os
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont, ImageColor
import json
import time
import random


# Токен бота
TOKEN = "8560281750:AAHJM-Vgo6E6qDZyuqXpBrsNTqPseHO3sNs"
API_URL = f"https://api.telegram.org/bot{TOKEN}"

# Папка для временного хранения фото
if not os.path.exists('photos'):
    os.makedirs('photos')

# Словарь для хранения данных пользователя
user_data = {}

# Спокойная цветовая палитра: черный, бежевый, серый
COLORS = {
    'background': '#000000',      # Глубокий черный фон
    'paper': '#1e1e1e',           # Темно-серый
    'text_primary': '#f5f5dc',    # Бежевый для основного текста
    'text_secondary': '#a9a9a9',  # Серый для второстепенного
    'accent': '#d2b48c',          # Светло-бежевый для акцентов
    'border': '#333333',          # Темно-серые линии
    'perforation': '#2a2a2a',     # Перфорация
    'stamp': '#8b7d6b'            # Серо-бежевый для штампа
}

def send_message(chat_id, text, parse_mode='Markdown', keyboard=None):
    """Отправка сообщения"""
    url = f"{API_URL}/sendMessage"
    data = {
        'chat_id': chat_id,
        'text': text,
        'parse_mode': parse_mode
    }
    if keyboard:
        data['reply_markup'] = json.dumps(keyboard)
    
    try:
        requests.post(url, json=data)
    except Exception as e:
        print(f"Ошибка отправки сообщения: {e}")

def send_photo(chat_id, photo_path, caption=''):
    """Отправка фото"""
    url = f"{API_URL}/sendPhoto"
    
    try:
        with open(photo_path, 'rb') as photo:
            files = {'photo': photo}
            data = {'chat_id': chat_id, 'caption': caption}
            requests.post(url, data=data, files=files)
    except Exception as e:
        print(f"Ошибка отправки фото: {e}")

def handle_updates():
    """Обработка обновлений"""
    last_update_id = 0
    
    print("╔════════════════════════════╗")
    print("║       ATLAS BOT            ║")
    print("║    Спокойный дизайн        ║")
    print("╚════════════════════════════╝")
    
    while True:
        try:
            url = f"{API_URL}/getUpdates"
            params = {'offset': last_update_id + 1, 'timeout': 30}
            response = requests.get(url, params=params, timeout=35)
            
            if response.status_code == 200:
                updates = response.json().get('result', [])
                
                for update in updates:
                    last_update_id = update['update_id']
                    process_update(update)
            
            time.sleep(1)
            
        except KeyboardInterrupt:
            print("\n👋 Бот остановлен")
            break
        except Exception as e:
            print(f"Ошибка в цикле обновлений: {e}")
            time.sleep(5)

def process_update(update):
    """Обработка одного обновления"""
    try:
        if 'message' in update:
            message = update['message']
            chat_id = message['chat']['id']
            user_id = message['from']['id']
            
            if 'text' in message and message['text'] == '/start':
                welcome_text = """
╔════════════════════════════╗
║          ATLAS            ║
║    Парфюмерный чек        ║
╚════════════════════════════╝

Добро пожаловать.

Команды:
/new - создать чек
/help - информация
                """
                keyboard = {
                    'inline_keyboard': [
                        [{'text': '📄 СОЗДАТЬ ЧЕК', 'callback_data': 'new_price'}],
                        [{'text': '📋 ИНФОРМАЦИЯ', 'callback_data': 'help'}]
                    ]
                }
                send_message(chat_id, welcome_text, keyboard=keyboard)
            
            elif 'text' in message and message['text'] == '/help':
                help_text = """
╔════════════════════════════╗
║         ИНФОРМАЦИЯ         ║
╚════════════════════════════╝

1. /new - начать создание
2. Загрузите фото
3. Укажите данные:
   • Название
   • Цена в PLN
   • Описание
                """
                send_message(chat_id, help_text)
            
            elif 'text' in message and message['text'] == '/new':
                user_data[user_id] = {
                    'photos': [],
                    'items': [],
                    'current_photo': None,
                    'chat_id': chat_id
                }
                send_message(chat_id, 
                    "╔════════════════════════════╗\n"
                    "║      НОВЫЙ ЧЕК            ║\n"
                    "╚════════════════════════════╝\n\n"
                    "Отправляйте фотографии.\n"
                    "После каждого фото укажите:\n"
                    "┌────────────────────────┐\n"
                    "│ Название               │\n"
                    "│ Цена в PLN             │\n"
                    "│ Описание               │\n"
                    "└────────────────────────┘"
                )
            
            elif 'text' in message and message['text'] == '/generate':
                if user_id in user_data and user_data[user_id]['items']:
                    send_message(chat_id, "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n📄 *СОЗДАЮ ЧЕК...*\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯")
                    generate_and_send(user_id)
                else:
                    send_message(chat_id, "❌ Нет данных. Используйте /new")
            
            elif 'photo' in message:
                if user_id not in user_data:
                    send_message(chat_id, "Сначала используйте /new")
                    return
                
                if len(user_data[user_id]['photos']) >= 10:
                    send_message(chat_id, "Достигнут лимит фотографий (10)")
                    return
                
                photo = message['photo'][-1]
                file_id = photo['file_id']
                
                file_url = f"{API_URL}/getFile"
                file_response = requests.get(file_url, params={'file_id': file_id})
                
                if file_response.status_code == 200:
                    file_path = file_response.json()['result']['file_path']
                    download_url = f"https://api.telegram.org/file/bot{TOKEN}/{file_path}"
                    
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                    photo_path = f"photos/photo_{user_id}_{timestamp}.jpg"
                    
                    img_response = requests.get(download_url)
                    with open(photo_path, 'wb') as f:
                        f.write(img_response.content)
                    
                    user_data[user_id]['photos'].append(photo_path)
                    user_data[user_id]['current_photo'] = photo_path
                    
                    send_message(chat_id, 
                        f"┌────────────────────────┐\n"
                        f"│  ✓ Фото {len(user_data[user_id]['photos'])} загружено │\n"
                        f"└────────────────────────┘\n\n"
                        "Отправьте информацию:\n"
                        "```\nНазвание\nЦена в PLN\nОписание\n```"
                    )
            
            elif 'text' in message:
                if user_id in user_data and user_data[user_id].get('current_photo'):
                    text = message['text']
                    lines = text.split('\n')
                    
                    if len(lines) >= 2:
                        try:
                            price_value = float(lines[1].strip().replace(',', '.'))
                            price_pln = f"{price_value:.2f} PLN"
                        except:
                            price_pln = lines[1].strip() + " PLN"
                            price_value = 0
                        
                        item_info = {
                            'name': lines[0].strip(),
                            'price': price_pln,
                            'price_value': price_value,
                            'description': lines[2].strip() if len(lines) > 2 else '',
                            'photo': user_data[user_id]['current_photo']
                        }
                        
                        user_data[user_id]['items'].append(item_info)
                        user_data[user_id]['current_photo'] = None
                        
                        send_message(chat_id,
                            f"┌────────────────────────┐\n"
                            f"│  ✓ {item_info['name'][:15]}...  │\n"
                            f"│    {item_info['price']}  │\n"
                            f"└────────────────────────┘\n\n"
                            f"Добавлено: {len(user_data[user_id]['items'])}\n"
                            "Продолжайте или /generate"
                        )
                    else:
                        send_message(chat_id, 
                            "❌ Неверный формат. Используйте:\n"
                            "```\nНазвание\nЦена в PLN\nОписание\n```"
                        )
        
        elif 'callback_query' in update:
            callback = update['callback_query']
            chat_id = callback['message']['chat']['id']
            data = callback['data']
            user_id = callback['from']['id']
            
            requests.post(f"{API_URL}/answerCallbackQuery", 
                         json={'callback_query_id': callback['id']})
            
            if data == 'new_price':
                user_data[user_id] = {
                    'photos': [],
                    'items': [],
                    'current_photo': None,
                    'chat_id': chat_id
                }
                send_message(chat_id, 
                    "╔════════════════════════════╗\n"
                    "║      НОВЫЙ ЧЕК            ║\n"
                    "╚════════════════════════════╝\n\n"
                    "Отправляйте фотографии."
                )
            elif data == 'help':
                help_text = """
╔════════════════════════════╗
║         ИНФОРМАЦИЯ         ║
╚════════════════════════════╝

• Загрузите фото
• Укажите название, цену в PLN, описание
• Получите чек
                """
                send_message(chat_id, help_text)
    
    except Exception as e:
        print(f"Ошибка обработки обновления: {e}")

def generate_and_send(user_id):
    """Генерация и отправка чека"""
    try:
        if user_id not in user_data:
            return
        
        items = user_data[user_id]['items']
        chat_id = user_data[user_id]['chat_id']
        
        # Размеры чека
        img_width = 1000
        img_height = 400 + (len(items) * 250)
        margin = 50
        
        # Создаем фон
        collage = Image.new('RGB', (img_width, img_height), color=COLORS['background'])
        draw = ImageDraw.Draw(collage)
        
        # Добавляем легкую текстуру
        for _ in range(500):
            x = random.randint(0, img_width)
            y = random.randint(0, img_height)
            gray = random.randint(0, 15)
            draw.point((x, y), fill=(gray, gray, gray))
        
        # Шрифты
        try:
            font_title = ImageFont.truetype("arialbd.ttf", 48)
            font_item = ImageFont.truetype("arial.ttf", 24)
            font_price = ImageFont.truetype("arialbd.ttf", 28)
            font_small = ImageFont.truetype("arial.ttf", 18)
            font_normal = ImageFont.truetype("arial.ttf", 22)
        except:
            font_title = ImageFont.load_default()
            font_item = ImageFont.load_default()
            font_price = ImageFont.load_default()
            font_small = ImageFont.load_default()
            font_normal = ImageFont.load_default()
        
        y_position = 40
        
        # Верхняя линия
        draw.line([(margin, y_position), (img_width - margin, y_position)], 
                  fill=COLORS['border'], width=2)
        
        y_position += 20
        
        # ATLAS
        atlas_text = "ATLAS"
        text_width = draw.textlength(atlas_text, font=font_title)
        draw.text(((img_width - text_width) // 2, y_position), atlas_text, 
                 font=font_title, fill=COLORS['text_primary'])
        
        y_position += 60
        
        # Линия под ATLAS
        draw.line([(margin, y_position), (img_width - margin, y_position)], 
                  fill=COLORS['border'], width=1)
        
        y_position += 20
        
        # Дата
        current_time = datetime.now().strftime("%d.%m.%Y  %H:%M")
        draw.text((img_width - 200, y_position), current_time, 
                 font=font_small, fill=COLORS['text_secondary'])
        
        y_position += 40
        
        total = 0
        
        # Добавляем товары
        for i, item in enumerate(items):
            # Фото товара
            if os.path.exists(item['photo']):
                try:
                    item_photo = Image.open(item['photo'])
                    photo_size = 80
                    item_photo.thumbnail((photo_size, photo_size))
                    
                    # Серая рамка
                    photo_with_border = Image.new('RGB', (photo_size + 4, photo_size + 4), COLORS['border'])
                    photo_with_border.paste(item_photo, (2, 2))
                    
                    collage.paste(photo_with_border, (margin, y_position))
                except Exception as e:
                    print(f"Ошибка при обработке фото: {e}")
            
            # Название
            name = item['name']
            draw.text((margin + 100, y_position + 10), name, 
                     font=font_item, fill=COLORS['text_primary'])
            
            # Цена
            draw.text((img_width - 150, y_position + 10), item['price'], 
                     font=font_price, fill=COLORS['accent'])
            
            # Описание
            if item['description']:
                desc = item['description']
                draw.text((margin + 100, y_position + 45), desc, 
                         font=font_small, fill=COLORS['text_secondary'])
            
            # Суммируем
            if 'price_value' in item:
                total += item['price_value']
            
            # Линия между товарами
            if i < len(items) - 1:
                y_line = y_position + 100
                draw.line([(margin, y_line), (img_width - margin, y_line)], 
                         fill=COLORS['border'], width=1)
            
            y_position += 120
        
        y_position += 20
        
        # Линия перед итогом
        draw.line([(margin, y_position), (img_width - margin, y_position)], 
                  fill=COLORS['border'], width=2)
        
        y_position += 30
        
        # Итог
        draw.text((margin, y_position), "ИТОГО:", font=font_normal, fill=COLORS['text_secondary'])
        draw.text((img_width - 200, y_position), f"{total:.2f} PLN", 
                 font=font_price, fill=COLORS['accent'])
        
        y_position += 60
        
        # Нижняя перфорация
        for x in range(margin, img_width - margin, 20):
            draw.rectangle([x, y_position, x + 8, y_position + 3], 
                          fill=COLORS['perforation'])
        
        y_position += 20
        
        # Благодарность
        thanks_text = "dziękujemy"
        text_width = draw.textlength(thanks_text, font=font_small)
        draw.text(((img_width - text_width) // 2, y_position), thanks_text, 
                 font=font_small, fill=COLORS['text_secondary'])
        
        y_position += 30
        
        # Нижняя линия
        draw.line([(margin, y_position), (img_width - margin, y_position)], 
                  fill=COLORS['border'], width=1)
        
        # Сохраняем
        output_path = f"atlas_receipt_{user_id}.jpg"
        collage.save(output_path, quality=95)
        
        # Отправляем
        caption = "📄 *ЧЕК ATLAS*\nЦены в PLN"
        send_photo(chat_id, output_path, caption)
        
        # Очищаем
        cleanup_user_files(user_id)
        if os.path.exists(output_path):
            os.remove(output_path)
            
    except Exception as e:
        print(f"Ошибка генерации: {e}")
        send_message(chat_id, "❌ Ошибка создания чека")

def cleanup_user_files(user_id):
    """Очистка файлов"""
    if user_id in user_data:
        for item in user_data[user_id].get('items', []):
            try:
                if 'photo' in item and os.path.exists(item['photo']):
                    os.remove(item['photo'])
            except:
                pass
        
        for photo in user_data[user_id].get('photos', []):
            try:
                if os.path.exists(photo):
                    os.remove(photo)
            except:
                pass
        
        del user_data[user_id]

if __name__ == '__main__':
    handle_updates()