import os

if 'NAME' in os.environ and len(os.environ['NAME'].strip()) > 0:
  name = os.environ['NAME'].strip()
else:
  name = 'World'

print('Hello ' + name + '!')