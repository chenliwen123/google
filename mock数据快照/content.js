// ==UserScript==
// @name         mock快照
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  mock数据快照，会把上一次成功的数据保存起来，等下一次访问报错的时候 把上一次的数据返回给你
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @run-at document-start
// @require      https://unpkg.com/ajax-hook@3.0.2/dist/ajaxhook.min.js
// ==/UserScript==

(function () {
  'use strict';
  // 创建/更新一个数据库
  let creatUpdateStore = function (name, verson = 1) {
    console.log('creatUpdateStore');
    // 打开数据库
    let request = window.indexedDB.open(name, verson);

    request.onsuccess = function (event) {
      console.log('open success');
    };

    request.onerror = function (event) {
      console.log('open fail');
    };

    request.onupgradeneeded = function (event) {
      let db = event.target.result;
      if (!db.objectStoreNames.contains(name)) {
        // 创建仓库对象（创建表格）
        // 这里我将主键设置为id
        let objectStore = db.createObjectStore(name, {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    };
  };

  // 往数据库中加数据
  let addDataStore = function (storeName, data, verson) {
    console.log('addDataStore');
    return new Promise((resolve, reject) => {
      let databaseName = storeName;
      let databaseVersion = verson || 1;
      let db;
      let request = indexedDB.open(databaseName, databaseVersion);
      request.onsuccess = function (event) {
        db = event.target.result;
        db = event.target.result;
        // 将数据保存到新建的对象仓库
        let objectStore = db
          .transaction(databaseName, 'readwrite')
          .objectStore(databaseName);

        try {
          objectStore.get(data.id);
          objectStore.put(data);
        } catch (e) {
          if (Array.isArray(data)) {
            data.forEach(function (dataItem) {
              // 添加一条数据
              objectStore.add(dataItem);
            });
            resolve();
          } else {
            // 添加一条数据
            objectStore.add(data);
            resolve();
          }
        }
      };
      request.onupgradeneeded = function (event) {
        let db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          // 创建仓库对象（创建表格）
          // 这里我将主键设置为id
          let objectStore = db.createObjectStore(storeName, {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
      };
    });
  };

  // 获取数据
  let getStoreData = function (name, key = 1) {
    console.log('getStoreData');
    return new Promise((resolve, reject) => {
      let request = indexedDB.open(name);
      request.onsuccess = function (event) {
        let db = event.target.result;
        let req;
        try {
          req = db.transaction(name, 'readwrite').objectStore(name).get(key); // 这里的“1”也是主键的键值
        } catch (e) {
          reject('用户失败');
        }
        if (!req) {
          return;
        }
        req.onsuccess = function () {
          resolve(req.result.value);
        };
        req.onerror = function () {
          reject('获取失败');
        };
      };
      request.onupgradeneeded = function (event) {
        let db = event.target.result;
        if (!db.objectStoreNames.contains(name)) {
          // 创建仓库对象（创建表格）
          // 这里我将主键设置为id
          let objectStore = db.createObjectStore(name, {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
      };
    });
  };
  creatUpdateStore('chenliwen');

  /**@function 区分参数和地址 */
  function queryurl(query, params) {
    const url = new URL(query);
    const extractedAddress = url.origin + url.pathname; // 提取地址和路径部分
    url.searchParams.delete('_t');
    for (let key in params) {
      url.searchParams.set(key, params[key]);
    }
    return `${extractedAddress}?${url.searchParams.toString()}`;
  }
  /**@function 代理ajax请求 */
  ah.proxy(
    {
      //请求发起前进入
      onRequest: (config, handler) => {
        console.log(config.url);
        handler.next(config);
      },
      //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
      onError: (err, handler) => {
        console.log(err);
        handler.next(err);
      },
      //请求成功后进入
      onResponse: async (response, handler) => {
        const key = queryurl(
          handler.xhr.responseURL,
          JSON.parse(response.config.body || '{}')
        );
        if (response.statusText === 'Gateway Timeout') {
          response.status = 200;
          response.statusText = 'OK';
          const res = await getStoreData('chenliwen', key);
          response.response = res;
        } else {
          addDataStore('chenliwen', {
            id: key,
            value: response.response,
          });
        }
        handler.next(response);
      },
    },
    window
  );
})();
