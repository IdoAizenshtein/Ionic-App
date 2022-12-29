# Building
### Debug
```
react-native run-android --variant=prodDebug
or
react-native run-android --variant=devDebug
```
`— variant=<productFlavour><BuildType>`

If you get error like a:
```
Error type 3
Error: Activity class {com.mmm/com.busdue.MainActivity} does not exist.
```
ii not a problem, just run the application manually in simulator/device.

### Building APK
From root directory of project run following commands:
```
cd android && ./gradlew assembleDevRelease
or
cd android && ./gradlew assembleProdRelease
or
cd android && ./gradlew assembleRelease
```
`assemble<ProductFlavour><BuildType>`
