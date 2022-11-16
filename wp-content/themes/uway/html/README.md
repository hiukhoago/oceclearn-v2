# COREFE 2.3.0

No need to introduce about this project, just enjoy it! Hell yeah!!
*Không cần phải giới thiệu nhiều, cài vô là "quay len"*

### Package in ###
*Có gì trong này?*

* [Bootstrap 4.0](https://getbootstrap.com/)
* [jQuery 3.3.1](https://jquery.com/)
* [Modernizr 2.8](https://modernizr.com/)
* [WOWJS](http://mynameismatthieu.com/WOW/)
* [Lazyload Image](https://github.com/tuupola/jquery_lazyload)

### How do I get set up and run? ###
*Làm sao để cài đặt và quẩy?*

| NPM           | Yarn              | Description   |
| ------------- |-------------------| :-----        |
| `npm install` | `yarn`            | install dependencies |
| `npm start`   | `yarn start`      | build first then watch project |
| `npm build`   | `yarn build`      | just build |

### What's news? ###
*Xài sao cho VIP?*

**Drop Image**

| Classname           | Description   |
| ------------- |:-----        |
| `.img-drop.ratio-169` | Drop image 16:9 |
| `.img-drop.ratio-43` | Drop image 4:3 |
| `.img-drop.ratio-11` | Drop image 1:1 |
| `.img-drop.____.sm-no-drop` | Drop image but no drop with mobile down on screen |

**Mixin columns**

| Mixin           | Description   |
| ------------- |:-----        |
| `@include make-col(number)` | Make class with `number` columns |
| `@include make-col(number, totalcolumn)` | Make class with `number` on `totalcolumn` columns |
| `@include space-col(10px)` | Make spacing between columns is 10px |