# gymapp

A new Flutter project.

## Getting Started
0. Clone the repo to your local machine
1. Download the flutter SDK
    1. you can add the VSCode extention named "Flutter" and it'll give you a warning once it's downloaded that you don't have the SDK. There should also be a button there to download SDK. Click the download button, choose a location, and VSCode will start downloadig the SDK. Once it has downloaded, VSCode will ask you if you wanna add the PATH to the environment variable. I suggest you do so.
2. Download the SDK platform tools for android.
3. On your android phone, unlock developer mode by tapping the build number repeatedly.
4. Once in developer mode, enable USB debugging and Wireless Debugging
5. plug your phone in, open command promt and type in "adb devices" and hit enter.
6. Accept the message on your phone.
7. Download the "ADB Interface for VSCode""extention.
8. In VSCode open the command pallet by pressing Ctrl + Shift + P
9. Type in "Connect to device IP" and type in the device IP that can be found inside the wireless debugging option on your andriod device. Just type in the IP, and not the port and hit enter
10. Type in the port number and your phone should now be ready for testing our app
11. You can hit F5 or "run without debugging" to see the app run on your phone. Make sure your phone is unlocked before you hit run though


