APDS7311 POE README

Running the program:
To obtain the files for the application, follow the GitHub repo link https://github.com/AlexGottschalkSE/APDS7311POE to find the repository. From there click the Green code button and select the method of accessing the code. It is recommended to click access via GitHub Desktop, and then open it in Visual Studio Code.

Upon opening the application install the necessary files by opening an integrated terminal for both the API and Frontend folders and run the command "npm i". Also run the command "npm install firebase-admin", and "npm install axios".

A few key steps must be taken in order to run the program. Due to needing to make the repo public for markers to access it, the firebase private key must be adjusted. If the private key is uploaded to the repo, google automatically detects the key as compromised, resulting in the key being made invalid. 
To get around this, valid key details will be included in the VCLearn submission. To add the correct key, upon opening the program  install the "apds-c658e-firebase-adminsdk-6jvhj-f7159291d6.json" file into the API folder. 
Save the changes, then use "node server.js" to run the API. THE API WILL NOT BE ABLE TO FETCH THE DATA FROM THE FIREBASE DATABASE IF THIS STEP IS NOT COMPLETED.

When running the program, if the application has issues fetching the data via the API, but the API is functioning as intended when tested in Postman, it is likely an issue with the .crt files. This is an issue that seems to ony affect some machines, while not affecting others. There are a few potential fixes:

1. Installing the Self-Signed Certificate on Windows
Double-click the server.crt file to open the Certificate Import Wizard.
Select Local Machine (you may need admin privileges).
Choose Place all certificates in the following store.
Select Trusted Root Certification Authorities.
Complete the wizard by clicking Next, then Finish.
Restart any browsers or applications that need to recognize the new certificate.
then try locally

2. Clear cache
If step one is completed and does not work, try to clear the cache of your browser.

3. Open the application in an incognito browser tab

4. --ignore-certificate-errors Browser
If all other options do not work, navigate to your Google chrome browser file in file explorer.
This will likely be found in Program Files or Program Files(x86).
This will most likely look like this: 
C:\Program Files (x86)\Google\Chrome\Application
Open cmd in the application folder
Run the command "chrome.exe --ignore-certificate-errors"
This will open a Chrome browser that ignores certificate errors, and will allow the program to function as intended.

To run the API, open an integrated terminal in Visual Studio Code for the API Folder, then enter the command "node server.js".
To run the Frontend, open an integrated terminal in Visual Studio Code for the Frontend Folder, then enter the command "npm start".

The program is run locally, but the database is hosted via Firebase.

Using the Program:
Upon startup of the application, the user is presented with the options to either register or login. If markers wish to make use of an existing login please use the following login details:
"accountNumber":"1234","username":"Test","password":"Password1"

Otherwise, the user can register their own account. The user must enter valid information, as if any information is missing or invalid, the user will be prompted to correct the missing details.
Upon logging in the user will be presented with the option to make a payment, upon entering valid payment details, as invalid details will make the application prompt the user to renter the payment details, the payment will be saved and a transaction ID will be presented.
From the dashboard, the user can also navigate to the Transaction History page. Upon loading the page, the application will display all previous transaction made by the currently logged in user.
