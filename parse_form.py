import re
import json

def parse_google_form(html_content):
    # Find the FB_PUBLIC_LOAD_DATA_ variable
    match = re.search(r'FB_PUBLIC_LOAD_DATA_ = (.*?);', html_content)
    if not match:
        print("Could not find FB_PUBLIC_LOAD_DATA_")
        return

    json_str = match.group(1)
    try:
        data = json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        return

    # The structure is complex, but the fields are usually in data[1][1]
    # data[1][1] is a list of form items
    
    if not data or len(data) < 2 or not data[1] or len(data[1]) < 2:
        print("Unexpected JSON structure")
        return

    form_items = data[1][1]
    
    print("Found Form Fields:")
    for item in form_items:
        # item structure varies, but title is usually item[1]
        # and inputs are in item[4]
        if not item or len(item) < 2:
            continue
            
        title = item[1]
        
        # Check if it has inputs
        if len(item) > 4 and item[4]:
            # item[4] contains the input details
            inputs = item[4]
            for input_field in inputs:
                # input_field[0] is the ID
                field_id = input_field[0]
                print(f"Field: '{title}', Entry ID: entry.{field_id}")
                # Check for options which are usually in item[1] (options list) of the input_field or separate
                # Actually, the options are defined at the question level in item[1]
                
        # Check for options in the question item
        # item[4] is the inputs list, item[1] is the title, item[3] is the type? 
        # For radio/checkbox/select, the options are typically in item[4][0][1]
        if len(item) > 4 and item[4] and len(item[4]) > 0 and len(item[4][0]) > 1:
             options = item[4][0][1]
             if options:
                print(f"  Options: {[opt[0] for opt in options if opt]}")
        else:
            print(f"Field: '{title}' (No input ID found, might be section header or image)")

if __name__ == "__main__":
    try:
        with open('google_form.html', 'r', encoding='utf-8') as f:
            content = f.read()
            parse_google_form(content)
    except UnicodeDecodeError:
        try:
            with open('google_form.html', 'r', encoding='utf-16') as f:
                content = f.read()
                parse_google_form(content)
        except Exception as e:
            print(f"Error reading file with utf-16: {e}")
    except FileNotFoundError:
        print("google_form.html not found")
