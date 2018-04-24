var can = document.querySelector("#canvas");
var ctx = can.getContext("2d");
var w, h, minW;
var blur = document.querySelector('#character-blur');
var customText = document.querySelector('#custom-text');

var config = {
    'audioSens': 10
  , 'topAudioBar': false
  , 'midAudioBar': true
  , 'bottAudioBar': false
  , 'customText': false
}

function normalize(val) {
  if (val < 100) {
    return val;
  }

  return 100;
}

function resize() {
  can.width = w = window.innerWidth;
  can.height = h = window.innerHeight;
  minW = Math.min(w, h);
}

resize();
window.onresize = resize;

ctx.lineWidth = 3;
ctx.shadowBlur = 15;

function wallpaperAudioListener(audioArray) {
    // Clears the rectangle

     ctx.clearRect(0, 0, can.width, can.height);

     // Render bars along the full width of the canvas
     var barWidth = (Math.round(1.0 / 128.0 * can.width)) / 3;
     var halfCount = audioArray.length / 2;

     // Begin with the left side in red
     ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
     ctx.shadowColor = 'rgba(102, 204, 255)';

     for (var i = 0; i < halfCount; ++i) {
         var height = normalize((can.height * audioArray[i]) / config.audioSens);
         ctx.fillStyle = 'rgba(255, 255, 255, ' + (height / 20) + ')';

         if (config.topAudioBar) {
           ctx.fillRect(barWidth * 3 * i, 0, barWidth, height);
         }

         if(config.midAudioBar) {
           ctx.fillRect(barWidth * 3 * i, can.height / 2, barWidth, height);
           ctx.fillRect(barWidth * 3 * i, (can.height / 2) - height, barWidth, height);
         }

         if (config.bottAudioBar) {
           ctx.fillRect(barWidth * 3 * i, can.height - height, barWidth, height);
         }
     }

     // Now draw the right side in blue
     ctx.fillStyle = 'rgba(255, 153, 204, 0.8)';
     ctx.shadowColor = 'rgba(255, 51, 153)';

     for (var i = halfCount; i < audioArray.length; ++i) {
         var height = normalize((can.height * audioArray[191 - i]) / config.audioSens);
         ctx.fillStyle = 'rgba(255, 153, 204, ' + (height / 20) + ')';

         if (config.topAudioBar) {
           ctx.fillRect(barWidth * 3 * i, 0, barWidth, height);
         }

         if (config.midAudioBar) {
           ctx.fillRect(barWidth * 3 * i, can.height / 2, barWidth, height);
           ctx.fillRect(barWidth * 3 * i, (can.height / 2) - height, barWidth, height);
         }

         if (config.bottAudioBar) {
           ctx.fillRect(barWidth * 3 * i, can.height - height, barWidth, height);
         }
     }

     var blurOpacity = Math.max.apply(null, audioArray);
     blur.style.opacity = blurOpacity;

     if (config.customText) {
       customText.style.textShadow = '#fff 0 0 ' + (blurOpacity * 20) + 'px';
     }
}

window.wallpaperPropertyListener = {
  applyUserProperties: function(properties) {
    if (properties.sens) {
      config.audioSens = 22 - properties.sens.value;
    }
    if (properties.topAudioBar) {
      config.topAudioBar = properties.topAudioBar.value;
    }
    if (properties.midAudioBar) {
      config.midAudioBar = properties.midAudioBar.value;
    }
    if (properties.bottAudioBar) {
      config.bottAudioBar = properties.bottAudioBar.value;
    }
    if (properties.customText) {
      customText.innerText = properties.customText.value;
    }
    if (properties.displayCustomText) {
      config.customText = properties.displayCustomText.value;
      if (properties.displayCustomText.value) {
        customText.style.display = 'block';
      } else {
        customText.style.display = 'none';
      }
    }
    if (properties.textY) {
      customText.style.top = properties.textY.value + '%';
    }
    if (properties.textSize) {
      customText.style.fontSize = properties.textSize.value + 'px';
    }
  }
};

window.onload = function() {
    window.wallpaperRegisterAudioListener(wallpaperAudioListener);
};
