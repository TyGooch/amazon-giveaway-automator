// This is a Greasemonkey script and must be run using a Greasemonkey-compatible browser.
//
// ==UserScript==
// @name         Amazon Giveaway Bot
// @version      2.0
// @author       Ty Gooch
// @updateURL    https://github.com/TyGooch/amazon-giveaway-automator/raw/master/amazonGiveawayBot.user.js
// @description  Automates Amazon giveaway entries
// @match        https://www.amazon.com/ga/*
// @match        https://www.amazon.com/ap/signin*
// @include        https://www.amazon.com/ga/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at        document-start
// ==/UserScript==


(function() {

  var isSignIn = window.location.href.includes("https://www.amazon.com/ap/signin") || document.querySelector('.cvf-account-switcher')
  var isMainPage = window.location.href.includes('?pageId=')
  var isGiveaway = window.location.href.includes('/ga/p')
  
  unsafeWindow.addEventListener(
    "load",
    () => {
      main()
    },
    false
  )

  async function init() { 
    console.log('init')   
    GM_setValue("running", false)
    
    if(!GM_getValue("lifetimeEntries")){
      GM_setValue("lifetimeEntries", 0)
    }
    if(!GM_getValue("totalWins")){
      GM_setValue("totalWins", 0)
    }

    var controlsTemplate =
      '<div id="container"\n' +
      "  style=\"font-family: Roboto,\\'Helvetica Neue\\',Helvetica,Arial,sans-serif;position: relative; min-width: 600px; margin: auto auto; color: #212529; background-color: #fff; border: 1px solid transparent; border-radius: .28571429rem; overflow: hidden; z-index: 9999; text-align: left; display: flex; flex-direction: column; justify-content: center;\">\n" +
      '  <div>\n' +
      '    <div style="padding: 16px; margin-top: 0; text-align: center;"><img style="width: 200px;  margin-left: auto; margin-right: auto;" src="https://i.ibb.co/xgYpv6T/giveaway-Bot-Logo-Blue.png" /></div>\n' +
      '    <button id="closeControls" style="margin-top: 8px; margin-right: 10px; border: 0; padding: 0; position: absolute; right: 0px; top: 0px; min-height: 1em; line-height: 1em; font-size: 2rem; color: rgba(0,0,0,.5)">×</button>\n' +
      '  </div>\n' +
      '  <div id="botFrameContainer" style="margin: auto auto; max-width: 600px; max-height: 384px;"></div>\n' +
      '  <div id="botOptions" style="display: flex; padding: 16px; padding-bottom: 0px; border-top: 1px solid #e9ecef; text-align: left;">\n' +
      '    <div style="padding-bottom: 10px;"><label for="twoCaptchaKey">2Captcha API Key</label><input id="twoCaptchaKey" style="width: 250px;" name="twoCaptchaKey" type="text" placeholdertype="Enter your key here"></input></div>\n' +
      '	    <div style="margin-left: 50px;">\n' +
      '	  	  <label id="">Disabled Giveaways</label>\n' +
      '	  	  <div style="padding-left: 7px;">\n' +
      '       <div><input id="disableKindle" name="disableKindle" type="checkbox"></input><span> Kindle Books</span></div>\n' +
      '	  	    <div><input id="disableVideo" name="disableVideo" type="checkbox"></input><span> Requires Video</span></div>\n' +
      ' 	    <div><input id="disableFollow" name="disableFollow" type="checkbox"></input><span> Requires Follow on Amazon</span></div>\n' +
      '	  	  </div>\n' +
      '	  	</div>\n' +
      '  </div>\n' +
      '  <div style="display:flex; padding: 16px; justify-content: space-between;">\n' +
      '    <span style="display: inline-block;" id="lifetimeEntries"><b>Giveaways Entered: </b><span style="" id="lifetimeEntriesValue"></span><span id="currentSessionEntries"> (<span style="" id="currentSessionEntriesValue"></span> this session)</span></span>\n' +
      '    <span style="display: inline-block;" id="totalWins"><b>Giveways Won: </b><span style="" id="totalWinsValue"></span></span>\n' +
      '  </div>\n' +
      '  <div style="border-top: 1px solid #e9ecef; background-color: rgb(249, 250, 251); display: flex; justify-content: flex-end; padding: 16px; text-align: left;">\n' +
      '  		<button id="run" style="background-color: #2185d0; border: 0; border-radius: .28571429rem; color: #fff; padding: .78571429em 1.5em; min-height: 1em; line-height: 1em; font-size: 1rem;">Start Bot</button>\n' +
      '  		<button id="stop" style="background-color: #d10919; border: 0; border-radius: .28571429rem; color: #fff;  padding: .78571429em 1.5em; min-height: 1em; line-height: 1em; font-size: 1rem;">Stop Bot</button>\n' +
      '  </div>\n'
      '</div>\n'

    if(!isSignIn && !isGiveaway){
      var controlsHTML = document.createElement("div")
      controlsHTML.id = "controlPanel"
      controlsHTML.style.position = "fixed"
      controlsHTML.style.top = "0px"
      controlsHTML.style.left = "0px"
      controlsHTML.style.width = "100vw"
      controlsHTML.style.height = "100vh"
      controlsHTML.style.display = "flex"
      controlsHTML.style.flexDirection = "column"
      controlsHTML.style.justifyContent = "center"
      controlsHTML.style.background = "rgba(0,0,0,0.85)"
      controlsHTML.style.zIndex = 9999
      controlsHTML.innerHTML = controlsTemplate
      document.body.appendChild(controlsHTML)
      
      document.querySelector("#run").style.display = GM_getValue("running") ? "none" : "block"
      document.querySelector("#stop").style.display = GM_getValue("running") ? "block" : "none"
      document.querySelector("#disableVideo").checked = GM_getValue("disableVideo")
      document.querySelector("#disableFollow").checked = GM_getValue("disableFollow")
      document.querySelector("#disableKindle").checked = GM_getValue("disableKindle")
      if (GM_getValue("twoCaptchaKey")) {
        document.querySelector("#twoCaptchaKey").value = GM_getValue("twoCaptchaKey")
      }
      document.querySelector("#lifetimeEntriesValue").innerHTML = GM_getValue("lifetimeEntries")
      document.querySelector("#totalWinsValue").innerHTML = GM_getValue("totalWins")
      document.querySelector("#currentSessionEntries").style.visibility = "hidden"
      document.querySelector("#twoCaptchaKey").style.border = "1px solid #ced4da"
      document.body.style.overflow = "hidden"

      var botLogoButton = document.createElement("div")
      botLogoButton.id = "botLogoButton"
      botLogoButton.style.width = "100vw"
      botLogoButton.style.height = "0px"
      botLogoButton.style.position = "relative"
      botLogoButton.style.top = "10px"
      botLogoButton.style.left = "0px"
      botLogoButton.style.textAlign = "center"
      botLogoButton.innerHTML = `<button id="botLogoButtonLink" style="margin: auto auto; padding: 10px; background: #fff; border: 0px;"><img style="width: 200px; background: #fff;" src="https://i.ibb.co/xgYpv6T/giveaway-Bot-Logo-Blue.png" /></button>`
  
      document.querySelector('header').appendChild(botLogoButton)
      document.body.style.overflow = "hidden"
      document.querySelector("#botLogoButtonLink").onclick = function() {
        document.body.style.overflow = "hidden"
        document.querySelector("#controlPanel").style.display = "flex"
      }
    }

    document.querySelector("#closeControls").onclick = function() {
      document.querySelector("#controlPanel").style.display = "none"
      document.body.style.overflow = "auto"
      if(GM_getValue("running")){
        GM_setValue("running", false)
        document.querySelector('#botFrame').remove()
      }

    }

    document.querySelector("#run").onclick = function() {
      GM_setValue("running", true)
      GM_setValue("processingGiveaways", false)
      GM_setValue("currentSessionEntries", 0)
      GM_setValue("currentIdx", 0)
      if(!GM_getValue("mainPageUrl")){
        GM_setValue("mainPageUrl", window.location.href)
      }
      if (document.querySelector("#twoCaptchaKey").value.length > 0) {
        GM_setValue("twoCaptchaKey", document.querySelector("#twoCaptchaKey").value)
      }
      GM_setValue("disableKindle", document.querySelector("#disableKindle").checked)
      GM_setValue("disableVideo", document.querySelector("#disableVideo").checked)
      GM_setValue("disableFollow", document.querySelector("#disableFollow").checked)

      document.querySelector("#run").style.display = "none"
      document.querySelector("#stop").style.display = "block"
      document.querySelector("#currentSessionEntries").style.visibility = "visible"
          
      var iframe = document.createElement('iframe');
      iframe.id = "botFrame"
      iframe.style.width = "1200px"
      iframe.style.height = "768px"
      iframe.style.transform = "scale(0.5)"
      iframe.style.transformOrigin = "top left"
      iframe.style.border = "1px solid #e9ecef"
      iframe.src = GM_getValue("mainPageUrl")
      document.querySelector("#botFrameContainer").appendChild(iframe)      
      document.querySelector("#botOptions").style.display = "none"      

      setInterval(function() {
        document.querySelector("#currentSessionEntriesValue").innerHTML = GM_getValue("currentSessionEntries")
        document.querySelector("#lifetimeEntriesValue").innerHTML = GM_getValue("lifetimeEntries")
        document.querySelector("#totalWinsValue").innerHTML = GM_getValue("totalWins")
        if (!GM_getValue("running")) {
          GM_setValue("running", false)
          GM_setValue("processingGiveaways", false)
          document.querySelector("#currentSessionEntries").style.visibility = "hidden"
          document.querySelector("#stop").style.display = "none"
          document.querySelector("#run").style.display = "block"
        }
      }, 100)
      unsafeWindow.addEventListener(
        "unload",
        () => {
          GM_setValue("running", false)
          GM_setValue("processingGiveaways", false)
        },
        false
      )
    }

    document.querySelector("#stop").onclick = function() {
      GM_setValue("running", false)
      document.querySelector("#currentSessionEntries").style.visibility = "hidden"
      document.querySelector("#stop").style.display = "none"
      document.querySelector("#run").style.display = "block"
      document.querySelector('#botFrame').remove()
      document.querySelector("#botOptions").style.display = "flex"
    }
  }

  async function doSignIn() {
    setInterval(() => {
      if(document.querySelector('.cvf-account-switcher-profile-details-after-account-removed')){
        document.querySelector('.cvf-account-switcher-profile-details-after-account-removed').click()
      }
      if(document.querySelector("#signInSubmit")){
        document.querySelector("#signInSubmit").click()
      }
      // solveCaptcha()
    }, 1000)
  }

  async function getGiveaways() {
    console.log('get')
    var setGiveaways = setInterval(() => {
      // go to first page if no giveaways are shown
      if(document.querySelector('#giveaway-listing-page-no-giveaway')){
        clearInterval(setGiveaways)
        GM_setValue("mainPageUrl", 'https://www.amazon.com/ga/giveaways/?pageId=1')
        window.location.href = 'https://www.amazon.com/ga/giveaways/?pageId=1'
      }
      var giveawayItems = document.querySelectorAll(".a-link-normal.item-link")
      if(giveawayItems.length > 0){
        var allowedGiveaways = []
        giveawayItems.forEach(item => {
          if(!(
            (GM_getValue("disableKindle") && item.innerText.includes('Kindle')) ||
            (GM_getValue("disableVideo") && item.innerText.includes('Watch a short video')) ||
            (GM_getValue("disableFollow") && item.innerText.includes('Follow')))
          ){
            let visited = GM_getValue('visitedLinks')
            if(!visited.includes(item.href.split('?')[0].replace('https://www.amazon.com/ga/p/', ''))){
              allowedGiveaways.push(item.href.split('?')[0])
            }
          }
        })
        if(allowedGiveaways.length > 0){
          GM_setValue('maxIdx', allowedGiveaways.length - 1)
          allowedGiveaways.forEach((url, idx) => {
            GM_setValue(`giveaway-${idx}`,url)
          })
          nextGiveaway()
        } else {
          console.log('NONE')
          let nextPage = window.location.href.split("pageId=")
          nextPage[nextPage.length - 1] = parseInt(nextPage[nextPage.length - 1]) + 1
          nextPage = nextPage.join("pageId=")
          GM_setValue("mainPageUrl", nextPage)
          window.location.href = nextPage
        }
        clearInterval(setGiveaways)
      }
    }, 100)
  }

  async function nextGiveaway() {
    GM_setValue("processingGiveaways", true)
    let idx = GM_getValue("currentIdx")
    let nextGiveaway = GM_getValue(`giveaway-${idx}`)
    idx += 1
    GM_setValue("currentIdx", idx)
    if (idx <= GM_getValue("maxIdx")) {
      let visited = GM_getValue('visitedLinks')
      if(!visited){
        GM_setValue('visitedLinks', '|' + nextGiveaway.replace('https://www.amazon.com/ga/p/', ''))
      } else {
        GM_setValue('visitedLinks', visited + '|' + nextGiveaway.replace('https://www.amazon.com/ga/p/', ''))
      }
      visited = GM_getValue('visitedLinks')
      if(visited.length > 27500){
        visited = visited.substr(visited.length - 27500);
      }
      GM_setValue('visitedLinks', visited)
      // console.log(GM_getValue('visitedLinks'))
      window.location.href = nextGiveaway
    } else {
      window.location.href = GM_getValue("mainPageUrl")
    }
  }

  async function enterGiveaway() {
      // if giveaway has video requirement, watch the video then enter
    let video = document.querySelector(".video")
    if (video || document.querySelector('#giveaway-youtube-video-watch-text') ||  document.querySelector('#airy-container')){
      if(GM_getValue("disableVideo")) {
        nextGiveaway()  
      }
      var continueButton
      if(document.querySelector('.amazon-video')){
        video.play()
        video.muted = true
        continueButton = document.querySelector(".amazon-video-continue-button")
      } else if(video){
        document.querySelector(".youtube-video div").click()
        continueButton = document.querySelector(".youtube-continue-button")
      } else if(document.querySelector('#airy-container')) {
        var playAiryVideo = setInterval(() => {
          if(document.querySelector('.airy-play-hint')){
            clearInterval(playAiryVideo)
            document.querySelector('.airy-play-hint').click()
            document.querySelector('.airy-audio-toggle').click()
            continueButton = document.querySelector("#enter-video-button")
          }
        }, 100)
      } else {
        continueButton = document.querySelector("#enter-youtube-video-button")
      }
      var waitForEntry = setInterval(() => {
        console.log(continueButton)
        // if(!continueButton){
        //   if(!continueButton)
        // }
        if (!continueButton.classList.contains("a-button-disabled")) {
          clearInterval(waitForEntry)
          if(continueButton.id.includes("-video-button")){
            continueButton.querySelector('input').click()
          } else {
            continueButton.click()
          }
          handleSubmit()
        }
      }, 1000)
    } else {
      if (document.querySelector('.follow-author-continue-button') || document.querySelector('.qa-amazon-follow-button')) {
        if(GM_getValue('disableFollow')){
          nextGiveaway()
        } else {
          if(document.querySelector('.qa-amazon-follow-button')){
            document.querySelector('.qa-amazon-follow-button').click()
          } else {
            document.querySelector('.follow-author-continue-button').click()
          }
        }
      }
      var submitEntry = setInterval(() => {
        console.log('submit')
        var boxToClick = document.querySelector('#box_click_target')
        if(!boxToClick){
          boxToClick = document.querySelector(".box-click-area")
        }
        if (boxToClick) {
          boxToClick.click()
          clearInterval(submitEntry)
          handleSubmit()
        }
      }, 100)
    }
  }

  // check page until results show up then continue to next giveaway in queue if not a winner
  async function handleSubmit() {
    // sometimes the first try doesn't work. If no results are displayed after 10 seconds try again.
    var tryAgain = setTimeout(enterGiveaway, 10000)

    var getResults = setInterval(() => {
      if (
        document.querySelector(".participation-post-entry-container") ||
        document.querySelector('#giveaway-addToCart-btn') ||
        document.querySelector('#free-sample-download-btn')
       
      ) {
        clearTimeout(tryAgain)
        clearInterval(getResults)
        if (
          (document.querySelector(".prize-title") && document.querySelector(".prize-title").innerHTML.includes("won")) ||
          (document.querySelector(".prize-header-container") && document.querySelector(".prize-header-container").innerHTML.includes("won"))
        ) {
          var wins = GM_getValue('totalWins')
          GM_setValue('totalWins', wins + 1)
          if(document.querySelector(".a-button-input")){
            document.querySelector(".a-button-input").click()
          } if(document.querySelector("#lu_co_ship_box")){
            document.querySelector("#lu_co_ship_box").click()
          }
          alert('Winner!')
          nextGiveaway()
        } else {
          nextGiveaway()
        }
        let lifetimeEntries = GM_getValue("lifetimeEntries")
        lifetimeEntries += 1
        GM_setValue("lifetimeEntries", lifetimeEntries)
        currentSessionEntries = GM_getValue("currentSessionEntries")
        currentSessionEntries += 1
        GM_setValue("currentSessionEntries", currentSessionEntries)
      }
    }, 100)
  }

  async function main() {
    if (GM_getValue("running")) {
      // submit login info if redirected to signin page
      if (isSignIn) {
        doSignIn()
        if(document.querySelector('#auth-captcha-img')){
          solveCaptcha()
        }
      } else if (isMainPage) {
        if (GM_getValue("currentIdx") > GM_getValue("maxIdx")) {
          GM_setValue("currentIdx", 0)
          GM_setValue("maxIdx", 23)
          let nextPage = window.location.href.split("pageId=")
          nextPage[nextPage.length - 1] = parseInt(nextPage[nextPage.length - 1]) + 1
          nextPage = nextPage.join("pageId=")
          GM_setValue("mainPageUrl", nextPage)
          window.location.href = nextPage
          GM_setValue("processingGiveaways", false)
        } else {
          getGiveaways()
        }
      } else if (isGiveaway) {
        var waitForTitle = setInterval(() => {
          if(document.querySelector(".prize-title") || document.querySelector(".prize-header-container") || document.querySelector('.a-spacing-small.a-size-extra-large')){
            clearInterval(waitForTitle)
            // if giveaway has already been entered, continue on to next giveaway in queue
            if (
              document.querySelector('.a-spacing-small.a-size-extra-large') ||
              (document.querySelector(".prize-title") && document.querySelector(".prize-title").innerText.includes("didn't win")) ||
              (document.querySelector(".prize-header-container") && document.querySelector(".prize-header-container").innerText.includes("didn't win"))
            ){
              nextGiveaway()
            }
            // use 2captcha to solve captchas if present
            else if (document.querySelector("#giveaway-captcha-container")) {
              solveCaptcha()
            }
            // otherwise enter giveaway
            else if(document.querySelector('.participation-need-action') || document.querySelector('.participation-action-item')){
              enterGiveaway()
            }
          }
        }, 100)
      }
    } else {
      init()
    }
  }

  async function solveCaptcha() {
    if(!GM_getValue('twoCaptchaKey').length > 0){
      alert('No 2Captcha API key was provided. Captcha cannot be solved without a key.')
    }
    let base64Img = getBase64Image(
      document.querySelector("#image_captcha img").src,
      res => {
        sendCaptcha(res)
      },
      err => {
        console.log(err)
      }
    )
  }
  
  async function sendCaptcha(imgUrl) {
    var apiKey = GM_getValue("twoCaptchaKey")
    fetch("https://2captcha.com/in.php", {
      method: "POST",
      body: JSON.stringify({
        key: apiKey,
        method: "base64",
        body: imgUrl,
        header_acao: 1,
        json: 1,
        soft_id: 7493321
      })
    })
      .then(res => res.json())
      .then(data => {
        let captchaId = data.request
        var decodeCaptcha = setInterval(() => {
          fetch("https://2captcha.com/res.php?key=" + apiKey + "&action=get&header_acao=1&json=1&id=" + captchaId, {
            method: "GET"
          })
            .then(res => res.json())
            .then(captchaAnswer => {
              if (captchaAnswer.status === 1) {
                clearInterval(decodeCaptcha)
                document.querySelector("#image_captcha_input").value = captchaAnswer.request
                document.querySelector(".a-button-input").click()
                // check for validity, try again if invalid
                setTimeout(() => {
                  if(document.querySelector("#ga-image-captcha-validation-error")){
                    fetch("https://2captcha.com/res.php?key=" + apiKey + "&action=reportbad&header_acao=1&json=1&id=" + captchaId, {
                      method: "GET"
                    })
                    solveCaptcha()
                  } else {
                    main()
                  }
                }, 1000);
              } else if (captchaAnswer.request === "ERROR_CAPTCHA_UNSOLVABLE") {
                clearInterval(decodeCaptcha)
              }
            })
        }, 5000)
      })
  }
  async function getBase64Image(url, onSuccess, onError) {
    var cors_api_host = "cors-anywhere.herokuapp.com"
    var cors_api_url = "https://" + cors_api_host + "/"
    var slice = [].slice
    var origin = window.location.protocol + "//" + window.location.host
    var xhr = new XMLHttpRequest()
    var open = XMLHttpRequest.prototype.open
    XMLHttpRequest.prototype.open = function() {
      var args = slice.call(arguments)
      var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1])
      if (targetOrigin && targetOrigin[0].toLowerCase() !== origin && targetOrigin[1] !== cors_api_host) {
        args[1] = cors_api_url + args[1]
      }
      return open.apply(this, args)
    }
  
    xhr.responseType = "arraybuffer"
    xhr.open("GET", url)
  
    xhr.onload = function() {
      var base64, binary, bytes, mediaType
  
      bytes = new Uint8Array(xhr.response)
      binary = [].map
        .call(bytes, function(byte) {
          return String.fromCharCode(byte)
        })
        .join("")
      mediaType = xhr.getResponseHeader("content-type")
      base64 = [btoa(binary)].join("")
      onSuccess(base64)
    }
    xhr.onerror = onError
    xhr.send()
  }
})()

