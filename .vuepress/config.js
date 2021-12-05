module.exports = {
  "title": "Nacy's Blog",
  "description": "星辰大海",
  "dest": "public",
  "base": "./",
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/favicon.ico"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  "theme": "reco",
  "themeConfig": {
    "nav": [
      {
        "text": "Home",
        "link": "/",
        "icon": "reco-home"
      },
      {
        "text": "TimeLine",
        "link": "/timeline/",
        "icon": "reco-date"
      },
      {
        "text": "Docs",
        "icon": "reco-message",
        "items": [
          {
            "text": "vuepress-reco",
            "link": "/docs/theme-reco/"
          }
        ]
      },
      {
        "text": "Contact",
        "icon": "reco-message",
        "items": [
          {
            "text": "GitHub",
            "link": "https://github.com/recoluan",
            "icon": "reco-github"
          }
        ]
      }
    ],
    "subSidebar": "auto",
    "sidebar": {
      "/docs/theme-reco/": [
        "",
        "theme",
        "plugin",
        "api"
      ],
      "/blogs/front-end/vue/": [
          "vue_module_dep",
          "vue_webpack",
          "vue_router",
          "vue_promise",
          "vue_axios",
          "vue_com",
          "Vuex"
      ],
      "/blogs/back-end/vue/": [
          "spring"
      ],
      "/blogs/front-end/js/":"auto"
    },
    "type": "blog",
    "blogConfig": {
      "category": {
        "location": 2,
        "text": "Category"
      },
      "tag": {
        "location": 3,
        "text": "Tag"
      }
    },
    "friendLink": [
      {
        "title": "午夜凶铃",
        "desc": "Enjoy when you can, and endure when you must.",
        "link": "http://150.158.49.119"
      },
      {
        "title": "Miyazono Kaori",
        "desc": "April In Your Lie",
        "email": "846212939@qq.com",
        "link": "https://www.xiangxu999.com"
      }
    ],
    "logo": "/logo.png",
    "search": true,
    "searchMaxSuggestions": 10,
    "lastUpdated": "Last Updated",
    "author": "Nacy",
    "authorAvatar": "/avatar.png",
    "record": "xxxx",
    "startYear": "2021"
  },
  "markdown": {
    "lineNumbers": true,
    "extractHeaders": [ 'h2', 'h3', 'h4','h5']
  }
}