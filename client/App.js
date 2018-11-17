import _ from 'lodash';
import React, { Component } from 'react';
import Menu from './Menu';

const toColor = require('color-spectrum');

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: {
                scaling: 1,
                offset: 0,
                normalize: true
            }
        };
    }

    componentDidMount() {
        this.start();
    }

    updateOptions(item) {
        const newOptions = this.state.options;
        this.state.options[item.name] = item.value;
        this.setState({ options: newOptions });
    }

    start() {
        const WIDTH = 270;
        const HEIGHT = 150;

        const BAR_WIDTH = 700;
        const BAR_HEIGHT = 700;

        const BAR_PLOT_HEIGHT = 20;

        let BAR_SLICE = 0;
        let ROW = 0;

        const BAR_SLICE_WIDTH = 2;

        const barElement = document.getElementById('bar');
        barElement.width = BAR_WIDTH;
        barElement.height = BAR_HEIGHT;

        const barCtx = barElement.getContext('2d');

        function drawSlice(color) {
            barCtx.fillStyle = color;
            barCtx.fillRect(BAR_SLICE % BAR_WIDTH, ROW, BAR_SLICE_WIDTH, BAR_PLOT_HEIGHT);

            BAR_SLICE += BAR_SLICE_WIDTH;
            ROW = (Math.floor(BAR_SLICE / BAR_WIDTH) * BAR_PLOT_HEIGHT) % BAR_HEIGHT;
        }

        const ctx = new AudioContext();
        const audio = document.getElementById('audio');

        const audioSrc = ctx.createMediaElementSource(audio);
        const analyser = ctx.createAnalyser();

        const colorElement = document.getElementById('color');

        analyser.connect(ctx.destination);

        const canvasCtx = document.getElementById('input-spectrum').getContext('2d');
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        analyser.fftSize = 512;

        const bufferLength = analyser.frequencyBinCount;
        // we have to connect the MediaElementSource with the analyser 
        audioSrc.connect(analyser);
        // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)

        // frequencyBinCount tells you how many values you'll receive from the analyser
        const frequencyData = new Uint8Array(bufferLength);

        function setColor(color) {
            colorElement.style.backgroundColor = color;
        }

        // we're ready to receive some data!
        // loop
        function renderFrame() {
            requestAnimationFrame(renderFrame.bind(this));
            // update data in frequencyData
            analyser.getByteFrequencyData(frequencyData);
            // render frame based on values in frequencyData
            // console.log(frequencyData)

            canvasCtx.fillStyle = 'rgb(0, 0, 0)';
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

            let sum = 0;

            for (let i = 0; i < frequencyData.length; i++) {
                sum += frequencyData[i];
            }

            const barWidth = (WIDTH / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const offsetValue = frequencyData[i] + this.state.options.offset;

                if (offsetValue < 0) {
                    frequencyData[i] = 0;
                } else if (offsetValue > 255) {
                    frequencyData[i] = 255;
                } else {
                    frequencyData[i] = offsetValue;
                }

                const scaledValue = Math.min(Math.max(frequencyData[i] * this.state.options.scaling, 0), 255);

                frequencyData[i] = scaledValue;

                sum += frequencyData[i];

                // draw spectrum analyzer
                barHeight = frequencyData[i] * (HEIGHT / 255);
                canvasCtx.fillStyle = 'white';
                canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, 2);
                x += barWidth + 1;
            }

            if (sum !== 0) {
                const color = toColor(frequencyData, { normalize: this.state.options.normalize });

                setColor(color);
                drawSlice(color);
            }
        }
        // audio.play();
        renderFrame.call(this);
    }

    render() {
        return (
            <div className="main">
                <Menu
                    options={this.state.options}
                    start={this.start.bind(this)}
                    updateOptions={this.updateOptions.bind(this)}
                />
                <div className="center">
                    <canvas className="bar" id="bar"></canvas>
                </div>
                <div>
                    <div id="color" className="color"></div>
                </div>

            </div>
        );
    }
}

export default App;
