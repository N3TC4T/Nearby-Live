cd android && ./gradlew assembleRelease
adb -s 'F7AZFG100813' install -r app/build/outputs/apk/app-release.apk
