import json
import os

def update_translations(file_path, new_translations):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        data = []
    
    trans_map = {item['key']: item['value'] for item in data}
    for key, value in new_translations.items():
        trans_map[key] = value
    
    updated_data = []
    seen_keys = set()
    for item in data:
        if item['key'] in trans_map:
            updated_data.append({'key': item['key'], 'value': trans_map[item['key']]})
            seen_keys.add(item['key'])
            
    for key, value in new_translations.items():
        if key not in seen_keys:
            updated_data.append({'key': key, 'value': value})
            
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(updated_data, f, indent=4, ensure_ascii=False)
    
    print(f"Updated {len(new_translations)} translations.")

last_5 = {
    "messenger.error": "Error",
    "common.retry": "Reintentar",
    "ai_usage.company_credentials": "Empresa",
    "ai_usage.system_credentials": "Sistema",
    "restore.validation_error": "Error de validación"
}

update_translations(r'e:\izk\chatbbot-abid\translations\es.json', last_5)
