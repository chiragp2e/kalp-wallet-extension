import { createKalpWallet, connectToWalletBackgroundListener } from 'kalp-wallet-extension-pkg';
let walletExtensionWindow = null;

console.log('walletExtensionWindow', walletExtensionWindow);
function ConnectToWallet(message) {
  console.log('walletExtensionWindow ConnectToWallet', walletExtensionWindow);

  if (walletExtensionWindow && !walletExtensionWindow.closed) {
    chrome.windows.update(walletExtensionWindow.id, { focused: true });
  } else {
    const ispopup = Popup(message);
    if (ispopup) {
      GetUserPermission(message);
    }
  }
}

function Popup(message) {
  console.log('heeh popup');
  chrome.windows.getCurrent({ populate: true }, currentWindow => {
    const popupWidth = 370;
    const popupHeight = 500;
    const left = currentWindow.left + currentWindow.width - popupWidth;
    const top = currentWindow.top;

    let homePageURL;
    console.log('message', message.methodName);
    if (message.methodName === 'connectToWallet') {
      homePageURL = chrome.runtime.getURL('popup.html');
    } else if (message.methodName === 'readTransaction') {
      homePageURL = chrome.runtime.getURL('popup.html#/HomePage');
    } else if (message.methodName === 'writeTransaction') {
      homePageURL = chrome.runtime.getURL('popup.html#/Asset');
    }

    console.log(homePageURL);
    // TODO: check the popup window should
    if (walletExtensionWindow && !walletExtensionWindow.closed) {
      chrome.windows.update(walletExtensionWindow.id, { focused: true });
    } else {
      chrome.windows.create(
        {
          url: homePageURL,
          type: 'popup',
          width: popupWidth,
          height: popupHeight,
          left: left,
          top: top,
        },
        newWindow => {
          walletExtensionWindow = newWindow;

          chrome.windows.onRemoved.addListener(closedWindowId => {
            if (walletExtensionWindow && closedWindowId === walletExtensionWindow.id) {
              walletExtensionWindow = null;
            }
          });
        }
      );
    }
  });

  return true;
}

function GetUserPermission(message) {
  var dappToken = message.dappToken;
  var dappName = message.dappName;
  var methodArgs = message.methodArgs;
  var methodCallId = message.methodCallId;
  var methodName = message.methodName;
  console.log('sign up note', dappToken, dappName, methodArgs, methodCallId, methodName);
  setTimeout(() => {
    chrome.runtime.sendMessage({
      type: 'SEND_TO_NOTE_CONTEXT',
      content: {
        dappToken,
        dappName,
        methodArgs,
        methodCallId,
        methodName,
      },
    });
  }, 100);
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === `GIVE_PERMISSION:${dappToken}`) {
      console.log('Received message in html script:', request);
      var response = request;
      if (request.message.permission === 'YES') {
        response.message.output = true;
      } else {
        response.message.output = false;
      }
      chrome.tabs.query({}, tabs => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, {
            type: `FROM_BACKGROUND_JS:${response.message.dappToken}`,
            message: response.message,
          });
        });
      });
    }
  });
}

function GetEnrollmentId() {
  //const enrollmentId = localStorage.getItem('enrollmentId');
  chrome.storage.local.get('enrollmentID', result => {
    if (chrome.runtime.lastError) {
      console.error('Error retrieving stored value:', chrome.runtime.lastError);
    } else {
      const storedValue = result.enrollmentID; // Access the value using the correct key
      const storedValue1 = result;
      console.log('Stored value:', storedValue);
      console.log('Stored value1:', storedValue1);
      return storedValue;
    }
  });
  // console.log('enrollmentID', enrollmentID);
  // return enrollmentId;
}

//demo
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'POPUP_TO_BACKGROUND') {
    console.log('Received message in background script:', message);
    var enrollmentID = message.data;
    chrome.storage.local.set({ enrollmentID }, () => {
      console.log('UUID saved successfully', enrollmentID);
    });
  }
});
//demo end

function SubmitTransaction(message) {
  console.log('walletExtensionWindow SubmitTransaction', walletExtensionWindow);
  console.log(message);
  const dappToken = message.dappToken;
  let transactionType = message;
  const channelName = transactionType.methodArgs[0];
  const chainCodeName = transactionType.methodArgs[1];
  const transactionNameBalance = transactionType.methodArgs[2];
  const transactionParams = transactionType.methodArgs[3];
  const methodArgs = [channelName, chainCodeName, transactionNameBalance, transactionParams];

  console.log(channelName, chainCodeName, transactionNameBalance, transactionParams, methodArgs);

  // const ispopup = kalpWallet.Popup(message);
  const ispopup = Popup(message);
  if (ispopup) {
    console.log('ispopup', ispopup);
    setTimeout(() => {
      chrome.runtime.sendMessage({
        type: 'FORM_SEND_TO_POPUP',
        content: {
          channelName,
          chainCodeName,
          transactionName: transactionNameBalance,
          transactionParams,
          dappToken,
        },
      });
    }, 100);
    setTimeout(() => {
      chrome.runtime.sendMessage(
        {
          type: `WRITE_TRANSACTION_BACKGROUND:${dappToken}`,
          content: {
            methodArgs,
            dappToken,
          },
        },
        response => {
          if (chrome.runtime.lastError) {
            console.error('Error sending message:', chrome.runtime.lastError.message);
            // Handle error here (e.g., call callback with error object)
          } else {
            console.log('Received response from homepage to background script:', response);
          }
        }
      );
    }, 100);

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.type === `TRANSACTION_ID:${dappToken}`) {
        console.log('Received message in html script:', request);
        var response = request;
        // if (request.message.permission === "YES") {
        //   response.message.output = true;
        // }else {
        //   response.message.output = false;
        // }
        chrome.tabs.query({}, tabs => {
          tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {
              type: `TRANSACTION_ID_FROM_BACKGROUND_JS:${dappToken}`,
              message: response.message,
            });
          });
        });
      }
    });
    // sendResponse("pass");
  }
}

function ReadTransaction(message) {
  console.log('bg js read transaction');
  const dappToken = message.dappToken;
  let transactionType = message;
  const channelName = transactionType.methodArgs[0];
  const chainCodeName = transactionType.methodArgs[1];
  const transactionNameBalance = transactionType.methodArgs[2];
  const transactionParams = transactionType.methodArgs[3];
  const methodArgs = [channelName, chainCodeName, transactionNameBalance, transactionParams];

  console.log('bg js read transaction content', message, methodArgs);

  chrome.runtime.sendMessage(
    {
      type: `READ_TRANSACTION_BACKGROUND:${dappToken}`,
      content: {
        methodArgs,
        dappToken,
      },
    },
    response => {
      if (chrome.runtime.lastError) {
        console.error('Error sending message:', chrome.runtime.lastError.message);
      } else {
        console.log('Received response from homepage to background script:', response);
        chrome.tabs.query({}, tabs => {
          tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {
              type: `READ_FROM_BACKGROUND_JS:${dappToken}`,
              message: response,
            });
          });
        });
      }
    }
  );
}

function DisconnectWallet(dappName) {
  console.log('hello discoo');
  let token = localStorage.getItem(`${dappName}_token`);
  console.log('token disconnect', token);
  localStorage.removeItem(`${dappName}_token`);

  return true;
}

const kalpWallet = createKalpWallet({
  Popup: Popup,
  ConnectToWallet: ConnectToWallet,
  GetEnrollmentId: GetEnrollmentId,
  WriteTransaction: SubmitTransaction,
  ReadTransaction: ReadTransaction,
  DisconnectWallet: DisconnectWallet,
});

console.log('hello signup background js 122');

connectToWalletBackgroundListener(kalpWallet);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'getGlobalObject') {
    sendResponse({ globalObject });
  }
});

// function comman(val, dappId) {
//   chrome.runtime.sendMessage({
//     msg: 'something_completed',
//     data: {
//       subject: 'Loading',
//       content: 'Just completed!',
//       dappId: dappId,
//     },
//   });
//   chrome.windows.getCurrent({ populate: true }, currentWindow => {
//     const popupWidth = 370;
//     const popupHeight = 500;
//     const left = currentWindow.left + currentWindow.width - popupWidth;
//     const top = currentWindow.top;

//     // Specify the URL for opening the HomePage directly
//     // Append "/HomePage" to the URL
//     let homePageURL;
//     console.log(`val is :${val}`);
//     if (val === 'Start') {
//       homePageURL = chrome.runtime.getURL('popup.html');
//     } else if (val === 'HomePage') {
//       homePageURL = chrome.runtime.getURL('popup.html#/HomePage');
//     } else if (val === 'AssetPage') {
//       homePageURL = chrome.runtime.getURL('popup.html#/Asset');
//     }

//     console.log(homePageURL);
//     chrome.windows.create(
//       {
//         url: homePageURL,
//         type: 'popup',
//         width: popupWidth,
//         height: popupHeight,
//         left: left,
//         top: top,
//       },
//       newWindow => {
//         console.log('Hi from background.js');
//         console.log('New window created:', newWindow);
//         walletExtensionWindow = newWindow;

//         // Add an event listener to handle window closure
//         chrome.windows.onRemoved.addListener(closedWindowId => {
//           if (walletExtensionWindow && closedWindowId === walletExtensionWindow.id) {
//             walletExtensionWindow = null;
//           }
//         });
//       }
//     );
//   });
// }

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SEND_TO_POPUP') {
    console.log(`popup done`);
    chrome.tabs.query({}, tabs => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'SIMPLE_MESSAGE',
          content: 'This is a simple message from the background script!',
        });
      });
    });
    if (walletExtensionWindow && !walletExtensionWindow.closed) {
      chrome.windows.update(walletExtensionWindow.id, { focused: true });
    } else {
      comman('Start');
    }
  } else if (message.type === 'ASSET_CREATED') {
    if (walletExtensionWindow && !walletExtensionWindow.closed) {
      chrome.windows.update(walletExtensionWindow.id, { focused: true });
    }
    console.log('Received asset created message in background script:', message.data);
    chrome.tabs.query({}, tabs => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'FROM_BACKGROUND_ASSET_CREATED',
          data: message.data,
        });
      });
    });
  }
  return true;
});
