<p align="center">
   <h3 align="center">LocalStorage with expiry and encrypt options</h3>
   <p align="center">A library for manipulating the local storage with expiry and encrypt options</p>
   <p align="center">
   	Open Source. Auto detect localstorage support or not. prevent the unimaging data in the local storage
   </p>
</p>


## Overview

LocalStorage with expiry and encrypt options is library for manipulating the local storage with expiry and encrypt options. 

It's designed for manipulating local storage and preventing the out of date data in the local storage.

the encrypt option is to protect the sensitive data in the local storage.

## Getting Started

copy the ts file in your project and import it in your source codes.

## Features

### Flexible and easy to use

-   Typescript format. 
-   Auto detect the local storage supporting
-   Auto delete the out of date data if expiry is on
-   Auto encrypt and decrypt by the injected encrypt function

### TypeScript

​	comes with built-in types.

## Example

### Import the library

```
import localSt, { type LocalStorageConfig } from '@/utils/localStorage';
```



### Use it directly ( without any configuration)

```
 const localValue = localSt.get('localValue');

localSt.set('localValue', localValue );
```





### Use it with expiry configuration

```
const config: LocalStorageConfig = { ttl: 100};

 const tokenWithExpriy = localSt.get('tokenWithExpriy', config);  // you will get null if the expiry time is due. the expired item will be deleted at same time

localSt.set('tokenWithExpriy', token, config);
```





### use it with Encrypter

```
const config: LocalStorageConfig = { ttl: 100, encrypter: (*value*: string) => { console.log(`encrypter`, value); return value.toLocaleUpperCase(); }, decrypter: (*value*: string) => { console.log(`encrypter`, value); return value.toLocaleLowerCase(); } };

 const tokenWithExpriy = localSt.get('tokenWithExpriy', config);

localSt.set('tokenWithExpriy', token, config);
```

