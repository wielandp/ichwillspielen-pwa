# node loglist.js
Zeigt Historie und löscht doppelte anonyme Anmeldungen

# node import_codes.js
Copiert aus dem Clipboard Codes auf Guthaben.
Format:
user@email.de	('H',18,1234, 'yxcvbn', 'firebase'),
	('H',18,1235, 'xcvbn', 'firebase'),

# offene (nicht gezahlte) codes auflisten
node notpaid.js >notpaid.csv & start notpaid.csv
node opencodes.js >opencodes.csv & start opencodes.csv

# node setpaid.js
Setzt Codes aus dem Clipboard auf bezahlt.
Format:
users/AqsU3CuqmEM8wAeKYT1f4G2QZYo2/codes	H-18-3793
users/AqsU3CuqmEM8wAeKYT1f4G2QZYo2/codes	H-18-3794

