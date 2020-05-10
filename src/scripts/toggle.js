// insert google font into document head
const fontLinkTag = `<link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">`
document.head.insertAdjacentHTML('beforeend', fontLinkTag)

// CSS toggle class
const toggleClass = (status) => {  
  if (status) {
    document.body.classList.remove('bso-disabled')
  } else {
    document.body.classList.add('bso-disabled')
  }
}

chrome.runtime.onMessage.addListener((request, sender, cb) => {
  toggleClass(request)
})

chrome.runtime.sendMessage({reload: true}, toggleClass)
