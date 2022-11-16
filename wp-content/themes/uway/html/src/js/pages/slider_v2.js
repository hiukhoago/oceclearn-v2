//-----------------------SLIDER BANNER----------------
let dataHomeBanners = [{
        image: "../../src/img/ecolearn-banner-1.png",
        title: "Giảm <span style='color:#008984; font-size: 96px;font-weight:700'>10%</span> khi mua hóa đơn <span style='color:#008984; font-size: 96px;font-weight:700'>200k</span>"
    },
    {
        image: "../../src/img/ecolearn-banner-2.png",
        title: "Giảm <span style='color:#008984; font-size: 96px;font-weight:700'>12%</span> khi mua hóa đơn <span style='color:#008984; font-size: 96px;font-weight:700'>400k</span>"
    },
    {
        image: "../../src/img/ecolearn-banner-3.png",
        title: "Giảm <span style='color:#008984; font-size: 96px;font-weight:700'>15%</span> khi mua hóa đơn <span style='color:#008984; font-size: 96px;font-weight:700'>900k</span>"
    },
    {
        image: "../../src/img/ecolearn-banner-4.png",
        title: "Giảm <span style='color:#008984; font-size: 96px;font-weight:700'>20%</span> khi mua hóa đơn <span style='color:#008984; font-size: 96px;font-weight:700'>4500k</span>"
    }
]

let index = -1;

function next() {
    index++;
    if (dataHomeBanners.length > 0) {
        if (index >= dataHomeBanners.length) index = 0;

        var img = document.getElementById('img-banner-index');
        if (img) {
            img.src = dataHomeBanners[index].image;
            document.getElementById("desc").innerHTML = dataHomeBanners[index].title;
        }
    }

}

function previous() {
    index--;
    if (index <= 0) index = dataBanners.length - 1;

    var img = document.getElementById("img");
    img.src = dataBanners[index].image;
    document.getElementById("desc").innerHTML = dataBanners[index].title;
}

const bannerHome = document.getElementsByClassName('body-content-banner');
const homePage = setInterval(next, 3000);
if (!bannerHome) {
    clearIntervel(homePage);
}

// indexBanner =  setInterval("next()", 3000);
// clearIntervel(indexBanner);

const dataBannerProducts = [{
        image: "../../src/img/product-banner-1.png",
        title: "<span style='color:#112848; font-size: 28px;font-weight:700;line-height: 120%;'>SẢN PHẨM VI SINH </span></br> <span style='color:#112848; font-size: 18px;font-weight:400; line-height: 27px; padding:5% 0;'>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.</span>"
    },
    {
        image: "../../src/img/product-banner-2.png",
        title: "<span style='color:#112848; font-size: 28px;font-weight:700;line-height: 120%;'>SẢN PHẨM VI SINH </span></br> <span style='color:#112848; font-size: 18px;font-weight:400; line-height: 27px; padding:5% 0;'>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.</span>"
    },
    {
        image: "../../src/img/product-banner-3.png",
        title: "<span style='color:#112848; font-size: 28px;font-weight:700;line-height: 120%;'>SẢN PHẨM VI SINH </span></br> <span style='color:#112848; font-size: 18px;font-weight:400; line-height: 27px; padding:5% 0;'>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.</span>"
    },
    {
        image: "../../src/img/product-banner-4.png",
        title: "<span style='color:#112848; font-size: 28px;font-weight:700;line-height: 120%;'>SẢN PHẨM VI SINH </span></br> <span style='color:#112848; font-size: 18px;font-weight:400; line-height: 27px; padding:5% 0;'>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.</span>"
    }
]
let i = -1;

function nextProductBanner() {
    i++;
    if (i >= dataBannerProducts.length) i = 0;

    var img = document.getElementById('product-banner');
    console.log(dataBannerProducts[i].image)
    if (img) {
        console.log(i)
        img.src = dataBannerProducts[i].image;
        document.getElementById('desc-product').innerHTML = dataBannerProducts[i].title;
    }
}
const bannerProduct = document.getElementsByClassName('body-content-product-banner');
let product = setInterval(nextProductBanner, 3000);
if (!bannerProduct) {
    clearIntervel(product);
}

//-----------------------INCREASE - DECREASE- AMOUNT ----------------
let amountElement = document.getElementById('amount');
let valueAmount = amountElement.value;
let handleDecrease = () => {
    if (valueAmount > 1)
        valueAmount--;
    amountElement.value = valueAmount;
};
let handleIncrease = () => {
    valueAmount++;
    amountElement.value = valueAmount;
};
//Bắt sự kiện input 
amountElement.addEventListener('input', () => {
    convertValueAmount = parseInt(valueAmount);
    console.log(convertValueAmount);
    convertValueAmount = (isNaN(convertValueAmount) || convertValueAmount == 0) ? 1 : convertValueAmount;
    document.getElementById('amount').value = convertValueAmount;
});
//-----------------------CLICK SMALL IMAGE SHOW LARGE IMAGE ----------------
function handleChangeImage(id) {
    let imagePath = document.getElementById(id).getAttribute('src');
    document.getElementById("main-img").setAttribute('src', imagePath);
}
//------------------------CART--------------------

//ADD TO CART