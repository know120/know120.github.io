let c = document.getElementById("my-canvas");
let ctx = c.getContext("2d");

// loadImage takes image path and load image present in that path
let loadImage = (src,callback) => {
    let img = document.createElement("img");
    img.onload = () => callback(img);
    img.src = src;
};

// imagePath generates the path for an animation
let imagePath = (frameNumber,animation) => {
    return "https://know120.github.io/images/" + animation + "/" + frameNumber + ".png";

};

let frames = {
    idle: [1,2,3,4,5,6,7,8],
    kick: [1,2,3,4,5,6,7],
    punch: [1,2,3,4,5,6,7],
    block: [1,2,3,4,5,6,7,8,9],
    forward: [1,2,3,4,5,6],
    backward: [1,2,3,4,5,6],
};

// load all the images for an particular animation spacified
let loadImages = (callback) => {
    let images = {idle:[],kick:[],punch:[],block:[],forward:[],backward:[]};
    let imagesToLoad = 0;

    ["idle","kick","punch","forward","backward","block"].forEach((animation) => {
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

// creates animation of a move
let animate = (ctx,images,animation,callback) => {
    images[animation].forEach((image,index) => {
        setTimeout(() =>{
            ctx.clearRect(50,50,300,300);
            ctx.drawImage(image,50,50,300,300);
        },index * 100);
    });

    setTimeout(callback,images[animation].length * 100);
};

loadImages((images)=> {
    let queuedAnimations = [];

    let aux = () =>{
        let selectedAnimation;

        if(queuedAnimations.length === 0){
            selectedAnimation = "idle";
        } else {
            selectedAnimation = queuedAnimations.shift();
        }
        animate(ctx,images,selectedAnimation,aux);
    };

    aux();

    // detects clicks on page
    document.getElementById("kick").onclick = () => {
        queuedAnimations.push("kick");
        console.log("Kicked");
    };
    
    document.getElementById("punch").onclick = () => {
        queuedAnimations.push("punch");
        console.log("Punched");
    };

    document.getElementById("block").onclick = () => {
        queuedAnimations.push("block");
        console.log("Blocked");
    };
    
    document.getElementById("forward").onclick = () => {
        queuedAnimations.push("forward");
        console.log("Going Forward");
    };

    document.getElementById("backward").onclick = () => {
        queuedAnimations.push("backward");
        console.log("Coming Backward");
    };

    // detects key on board
    document.addEventListener("keyup",(event) =>{
        const key = event.key;
        if (key === "ArrowLeft"){
            queuedAnimations.push("kick");
        } else if (key === "ArrowRight"){
            queuedAnimations.push("punch");
        }else if (key === "ArrowUp"){
            queuedAnimations.push("block");
        }else if (key === "a" || key === "A"){
            queuedAnimations.push("forward");
        }else if (key === "d" || key === "D"){
            queuedAnimations.push("backward");
        }
    });
});


// When the user clicks on the button, scroll to the top of the document
let topFunction = () =>{
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }


/*
//Get the button:
mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = () => {scrollFunction()};

let scrollFunction = () =>{
    //if (document.body.scrollTop > 20 || document.getElementById("myBtn").scrollTop > 20) {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    //document.getElementById("myBtn").style.display = "none";
    mybutton.style.display = "none";
  }
}
*/
