# rename files from ortex
import os

filenames = os.listdir('data')
for file in filenames:
    if len(file) < 22:
        continue
    new = file.split(' ')[0][22:]
    if new.startswith('NYSE'):
        new = new[4:] + '-nyse'
    elif new.startswith('Nasdaq'):
        new = new[6:] + '-nsdq'
    os.rename(f'data/{file}', f'{new}.csv')
    