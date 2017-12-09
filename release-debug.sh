#!/bin/bash

echo -e "[!] Creating Release APK ... \n"

cd android && ./gradlew assembleRelease

if hash adb 2>/dev/null; then
    echo -e "\n[!] Installing on android devices with ADB ..."
    for line in `adb devices | grep -v "List"  | awk '{print $1}'`
    do
      device=`echo $line | awk '{print $1}'`
      echo -e "[+] trying to install on device $device ..."
      adb -s $device install -r app/build/outputs/apk/app-release.apk
    done
else
    echo "\n[!] ADB is not installed , please install it and try again ."
fi