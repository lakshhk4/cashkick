import pandas as pd
from bs4 import BeautifulSoup 
import requests
import pickle
from selenium.webdriver.chrome.service import Service
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
import time
from selenium.webdriver.common.by import By
from selenium.webdriver import DesiredCapabilities
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import random

links = []

req = requests.get('https://www.fut.gg/players/')
soup = BeautifulSoup(req.content, 'html.parser')

players = soup.find_all('div',class_='-my-1')


'''
file = open('links.pkl', 'wb')

#print(soup.find('div', class_='pagination').find_all('a')[1]['href'])
count = 2
while count<713:
    for player in players:
        links.append('https://www.fut.gg/'+player.find('a')['href'])
    req_temp_url = 'https://www.fut.gg/players/?page='+str(count)
    req_temp = requests.get(req_temp_url)
    soup_temp = BeautifulSoup(req_temp.content, 'html.parser')
    players = soup_temp.find_all('div',class_='-my-1')
    print(req_temp_url)
    count+=1
print(links)

pickle.dump(links, file)
# close the file
file.close()
'''

file = open('links.pkl', 'rb')

# dump information to that file
player_links = pickle.load(file)

file.close()
#random.shuffle(player_links)

#player_links = player_links[0:100]

print(player_links)


print(len(player_links))

data = []

count = 0

for player in player_links:
    if count==50:
        break
    try:
        print(count)
        print(player)
        options = webdriver.ChromeOptions() 
        options.add_argument('--headless') 

        #options.page_load_strategy = 'eager'
        prefs = {"profile.managed_default_content_settings.images": 2}
        options.add_experimental_option("prefs", prefs)
        options.add_argument("--blink-settings=imagesEnabled=false")
        options.add_experimental_option("prefs", {"profile.default_content_setting_values": {"stylesheet": 2}})
        #driver = webdriver.Chrome()
        driver = webdriver.Chrome(options=options)
        driver.get(player)

        
        # this is just to ensure that the page is loaded 
        time.sleep(5)  

        page_source = driver.page_source
        
        #req_temp = requests.get(player)

        soup_temp = BeautifulSoup(page_source, 'html.parser')
        #soup_temp = BeautifulSoup(req_temp.content, 'html.parser')

        #name, rating, position, price, pace, version, leage, nation, average_bin

        d = {'url':player}

        #attribtues
        attribute_list = ['Nationality','Player ID']

        try:
            rarity = soup_temp.find_all('div',class_='inline-block')[1].text.strip()
            d['rarity'] = rarity
        except:
            pass

        name = soup_temp.find('div',class_='flex justify-between').find_all('div')[1].string
        d['name'] = name.strip()

        club = soup_temp.find('div',class_='flex justify-between flex-row mt-2').find('a').text.strip()
        d['club'] = club
        
        overall = int(soup_temp.find('span',class_='text-lighter-gray font-bold hidden md:inline-block text-base ml-2').string.split(' OVR')[0])
        d['overall'] = overall

        price = soup_temp.find('div',class_='font-bold text-2xl flex flex-row items-center gap-1 justify-self-end').get_text(strip=True)
        d['price'] = price

        position = soup_temp.find('div',class_='font-cruyff-condensed-medium leading-none text-[0.83em] -mt-[0.07em]').string
        d['position'] = position

        vers_img = soup_temp.find('img',class_='absolute w-full h-full top-0 left-0 object-cover')['src']
        print(vers_img)
        d['vers_img'] = vers_img

        attr = soup_temp.find_all('div', attrs={'data-rating-text': True})[0:3]
        nums = []
        for a in attr:
                nums.append(int(a.string))
        d['pace'] = nums[0]
        d['shooting'] = nums[1]
        d['passing'] = nums[2]
        #price = soup_temp.find_all('span',class_='price-coin')
        #print(price)
        #d['price'] = price

        nation_img = soup_temp.find('img', alt='Nation')
        if nation_img:
            nation_img = nation_img['src']
            d['nation_img'] = nation_img
        else:
            pass

        league_img = soup_temp.find('img', alt='League')
        if league_img:
            league_img = league_img['src']
            d['league_img'] = league_img
        else:
            pass

        club_img = soup_temp.find('img', alt='Club')
        if club_img:
            club_img = club_img['src']
            d['club_img'] = club_img
        else:
            pass
        data.append(d)
        print(d)

        driver.close() # closing the webdriver 
        count+=1
    except:
        continue

pd.DataFrame(data).to_csv("data.csv")

file = open('data.pkl', 'wb')

print(data)

# dump information to that file
pickle.dump(data, file)

file.close()


'''
[<div class="font-bold text-center" data-number="96" data-rating-text="">96</div>, <div class="font-bold text-center" data-number="93" data-rating-text="">93</div>, 
<div class="font-bold text-center" data-number="95" data-rating-text="">95</div>,
<div class="font-bold text-center" data-number="97" data-rating-text="">97</div>, 
<div class="font-bold text-center" data-number="56" data-rating-text="">56</div>, 
<div class="font-bold text-center" data-number="85" data-rating-text="">85</div>]
'''