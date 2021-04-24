let c = document.getElementById("my-canvas");
let ctx = c.getContext("2d");

let loadImage = (src,callback) => {
    let img = document.createElement("img");
    img.onload = () => callback(img);
    img.src = src;
};

let imagePath = (frameNumber,animation) => {
    return "/finisher/images/" + animation + "/" + frameNumber + ".png";

};

let frames = {
    idle: [1,2,3,4,5,6,7,8],
    kick: [1,2,3,4,5,6,7],
    punch: [1,2,3,4,5,6,7],
};

let loadImages = (callback) => {
    let images = {idle:[],kick:[],punch:[]};
    let imagesToLoad = 0;

    ["idle","kick","punch"].forEach((animation) => {
        let animationFrames = frames[animation];
        imagesToLoad = imagesToLoad + animationFrames.length;

        animationFrames.forEach((frameNumber) => {
            let path = imagePath(frameNumber,animation);

            loadImage(path,(image) =>{
                images[animation][frameNumber - 1] = image;
                imagesToLoad = imagesToLoad -1;

                if(imagesToLoad === 0){
                    callback(images);
                }
            });
        });
    });
};

let animate = (ctx,images,animation,callback) => {
    images[animation].forEach((image,index) => {
        setTimeout(() =>{
            ctx.clearRect(0,0,500,500);
            ctx.drawImage(image,0,0,500,500);
        },index = 100);
    });

    setTimeout(callback,images[animation].length * 100);
};

loadImages((image)=> {
    let queuedAnimation = [];

    let aux = () =>{
        let selectedAnimation;

        if(queuedAnimation.length === 0){
            selectedAnimation = "idle";
        } else {
            selectedAnimation = queuedAnimation.shift();
        }
        animate(ctx,images,selectedAnimation,aux);
    };

    aux();
});


/*
//Get the button:
mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

*/
