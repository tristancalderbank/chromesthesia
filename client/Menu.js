import React, { Component } from 'react';

class Menu extends Component {
    render() {
        return (
            <div className="menu">
                <div className="options-item">
                    <div className="options-item-header">Input Spectrum:</div>
                    <canvas id="input-spectrum" width="270" height="150"></canvas>
                </div>
                <div className="options-item">
                    <div className="options-item-header">
                        <span>Scaling:</span>
                        <span
                            className="slider-val"
                            type="number"
                        >
                            {this.props.options.scaling}
                        </span>
                    </div>
                    <input
                        className="slider"
                        id="scaling"
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.01"
                        value={this.props.options.scaling}
                        onChange={(e) => {
                            this.props.updateOptions({
                                name: 'scaling',
                                value: parseFloat(e.target.value)
                            })
                            ;
                        }}
                    />
                </div>
                <div className="options-item">
                    <div className="options-item-header">
                        <span>Offset:</span>
                        <span
                            className="slider-val"
                            type="number"
                        >
                            {this.props.options.offset}
                        </span>
                    </div>
                    <input
                        className="slider"
                        id="offset"
                        type="range"
                        max="255"
                        min="-255"
                        value={this.props.options.offset}
                        onChange={(e) => {
                            this.props.updateOptions({
                                name: 'offset',
                                value: parseFloat(e.target.value)
                            })
                            ;
                        }}
                    />
                </div>
                <div className="options-item">
                    <input
                        id="normalize"
                        type="checkbox"
                        checked={this.props.options.normalize}
                        onChange={(e) => {
                            this.props.updateOptions({
                                name: 'normalize',
                                value: e.target.checked
                            })
                            ;
                        }}
                    />
                    <span>Normalize</span>
                </div>
                <audio id="audio"
                    src="DNA.mp3"
                    crossOrigin="anonymous"
                    controls="true"
                >
                </audio>
            </div>
        );
    }
}

export default Menu;
