import json

def find_missing_keys(en_file, es_file):
    with open(en_file, 'r', encoding='utf-8') as f:
        en_data = json.load(f)
    
    with open(es_file, 'r', encoding='utf-8') as f:
        es_data = json.load(f)
    
    en_keys = {item['key']: item['value'] for item in en_data}
    es_keys = {item['key']: item['value'] for item in es_data}
    
    missing_keys = []
    for key, value in en_keys.items():
        if key not in es_keys:
            missing_keys.append({'key': key, 'en_value': value})
            
    return missing_keys

missing = find_missing_keys(r'e:\izk\chatbbot-abid\translations\en.json', r'e:\izk\chatbbot-abid\translations\es.json')

# Output the first 100 missing keys to avoid overwhelming the output
print(json.dumps(missing, indent=2, ensure_ascii=False))
