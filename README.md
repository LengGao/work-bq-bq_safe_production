# bq_safe_production

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



# postCSS 以及 transformPx 配置不会对style内联样式进行转换
```

因此在使用Icon与内联样式时要自己计算并加单位
ps: UI 搞通常为750px 屏幕为 375px  1rpx = 0.5px，但是transformPx只是对字体单纯的将px变为rpx而已并不会除以2
同时自定义样式变量不要和uni.sccc中的重名，否则可能不是覆盖而是优先使用uni.scss中的变量，例如字体尺寸变量