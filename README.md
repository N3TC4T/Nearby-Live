<p align="center"><img width=12.5% src="https://user-images.githubusercontent.com/6250203/33339853-afbfa50c-d48f-11e7-8fc6-40ce3bcac338.png"></p>

<br>
<br>


&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
[![React-Native](https://img.shields.io/badge/react--native-0.50.3-green.svg)](https://facebook.github.io/react-native)
[![Build Status](https://travis-ci.org/N3TC4T/Nearby-Live.svg?branch=master)](https://travis-ci.org/anfederico/Clairvoyant)
![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg)
[![GitHub Issues](https://img.shields.io/github/issues/N3TC4T/Nearby-Live.svg)](https://github.com/N3TC4T/Nearby-Live/issues)
![Contributions welcome](https://img.shields.io/badge/contributions-welcome-orange.svg)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Basic Overview

An iOS and Android client for http://wnmlive.com/ written in [React Native](https://facebook.github.io/react-native/) with [Redux](http://redux.js.org/).



## Screenshots
<p align="center"><img width=30% src="https://user-images.githubusercontent.com/6250203/33338954-e72d46dc-d48c-11e7-9336-c5e36d4d6b5e.png"> <img width=30% src="https://user-images.githubusercontent.com/6250203/33338956-e77a8f96-d48c-11e7-8c25-985d67359c3c.png"> <img width=30% src="https://user-images.githubusercontent.com/6250203/33338957-e7f34fe4-d48c-11e7-8024-d8d6ef872769.png"></p>


## Existing functionalities

- [ ] Authentication
  - [x] Sign in ( Facebook, Email)
  - [ ] Sign out
- [ ] Stream
  - [x] Recent, Following, Trending
  - [ ] Filter by Location
- [ ] Post
  - [x] Watch Post & Unwatch
  - [x] View post detail and comments
  - [x] Report objectionable content
  - [ ] Publish Post
  - [ ] Upload images & GIF
- [ ] Conversation
  - [x] Conversations List
  - [ ] View Conversation detail
  - [ ] Send Image & Voice & Video
- [ ] People
- [ ] Notifications
  - [x] View list of notifications
  - [ ] Notification alert (Push notification)
- [ ] Profile
  - [x] User profile
  - [x] User posts
  - [ ] User photos
  - [x] User gifts
- [ ] Account Settings
  - [ ] Profile edit
  - [ ] Profile picture
  - [ ] Privacy Settings


## Installation
Ensure that you're using **NodeJS 7** or newer on OSX. Android projects can be built and tested on Linux and Windows, but for iOS you need OSX . 

Before getting started, ensure you follow the [official React Native Getting Started guide](https://facebook.github.io/react-native/docs/getting-started.html) for your desired platform (iOS/Android). It is also recommended to have the react-native-cli installed:

```shell
yarn global add react-native-cli
```

Run the following to initialise the project:

```shell
yarn
```

### iOS development
Providing Xcode is setup correctly, Follow link bellow for running in Xcode :

[Running on IOS Devices](http://facebook.github.io/react-native/docs/running-on-device.html#running-your-app-on-ios-devices)
 
Also don't forget to install Pod dependencies 
```shell
pod install
```

- for opening project in Xcode use `Nearby.xcworkspace`


### Android development
Ensure that Android Studio is setup correctly and that an AVD has been created. The virtual device must be on **API level 23** or greater running **Android 6.0** or newer. You must have the AVD started before continuing with no other devices connected. To ensure you only have one device running, execute the following on the command-line:

```shell
adb devices
```

To run the application in the virtual device, run the following:

```shell
yarn start:android
```

#### Running on an Android device
To run on an actual device, first terminate any AVDs that are running. Connect the phone over USB and run `adb devices` to ensure that it shows up. You can then run `yarn start:android` to launch the application on the device.

The same software version restrictions apply to real devices.

#### Building an APK
To build a signed APK:

 1. Close all other development resources for the project.
 2. Uncomment `signingConfigs` section in `android/app/build.gradle` and set params as your .keystore file .
 3. Run `release-debug.sh` (it's gonna build an Signed APK and Install on your device)


## Other Projects
#### Nearby Live Desktop 
Nearby Live for OSX and Linux Desktop  
```text
https://github.com/N3TC4T/Nearby-Live-Desktop
```

## Contributing
Please take a look at our [contributing](https://github.com/N3TC4T/Nearby-Live/blob/master/CONTRIBUTING.md) guidelines if you're interested in helping!

### Development
Please keep in-line with the code style of each file, regardless of what tests are run (linting etc.). When creating new files their format is expected to closely resemble that of other existing source files.