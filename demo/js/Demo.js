import React from 'react';
import Tabs from "react-simpletabs";
import BarChart from '../../src/BarChart.js';
import axios from 'axios';

class Demo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            barDataCPU_Utilization :[{
                label: 'cpu-utilization',
                values: [{x: '1', y: 0}]
            }],
            barDataCPU_Interupts:[{
                label: 'cpu-interupts',
                values: [{x: '1', y: 0}]
            }],
            barDataMem_Percent :[{
                label: 'mem',
                values: [{x: '1', y: 0}]
            }]
        }
    }

    fetchCpuData() {

        var _this = this;
        axios.get('http://34.239.233.186:61208/api/3/cpu')
            .then(function (response) {
                console.log('CPU Response : ',response.data);
                if(localStorage.getItem('cpu-records')){
                    var arr = JSON.parse(localStorage.getItem('cpu-records'));
                    arr.push(response.data);
                    localStorage.setItem('cpu-records',JSON.stringify(arr));
                }else{
                    var arr = [];
                    arr.push(response.data);
                    localStorage.setItem('cpu-records',JSON.stringify(arr));
                }
                var cpu_records = JSON.parse(localStorage.getItem('cpu-records'));
                _this.setState(state=>{
                    console.log('All cpu records : ',cpu_records);
                    state.barDataCPU_Utilization[0].values = [];
                    state.barDataCPU_Interupts[0].values = [];
                    for(var i=0;i<cpu_records.length;i++){
                        state.barDataCPU_Utilization[0].values.push({
                            x:''+(i+1),
                            y:cpu_records[i].total
                        });
                        state.barDataCPU_Interupts[0].values.push({
                            x:''+(i+1),
                            y:cpu_records[i].interrupts
                        })
                    }
                    return state;
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    fetchMemData(){
        var _this = this;
        axios.get('http://34.239.233.186:61208/api/3/mem')
            .then(function (response) {
                console.log('Mem Response : ',response.data);
                if(localStorage.getItem('mem-records')){
                    var arr = JSON.parse(localStorage.getItem('mem-records'));
                    arr.push(response.data);
                    localStorage.setItem('mem-records',JSON.stringify(arr));
                }else{
                    var arr = [];
                    arr.push(response.data);
                    localStorage.setItem('mem-records',JSON.stringify(arr));
                }
                var mem_records = JSON.parse(localStorage.getItem('mem-records'));
                _this.setState(state=>{
                    console.log('All MemRecords:',mem_records);
                    state.barDataMem_Percent[0].values = [];

                    for(var i=0;i<mem_records.length;i++){
                        state.barDataMem_Percent[0].values.push({
                            x:''+(i+1),
                            y:mem_records[i].percent
                        });
                    }
                    return state;
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    componentWillMount(){
        var _this = this;
        _this.fetchCpuData();
        _this.fetchMemData();
        // setInterval(function(){
        //     _this.fetchCpuData();
        //     _this.fetchMemData();
        // },3000);
    }


    render(){

        const colorScale= d3.scale.category20();
        const margin = {top: 10, bottom: 50, left: 50, right: 10};

        const barToolTips = function(x, y0, y, total, dataLabel){
            return (
                <div className='tip'>
                    <dl>
                        <dt>x</dt>
                        <dd>{ x }</dd>
                        <dt>y0</dt>
                        <dd>{y0}</dd>
                        <dt>total</dt>
                        <dd>{total}</dd>
                        <dt>dataLabel</dt>
                        <dd>{dataLabel}</dd>
                    </dl>
                </div> );
        };

        const toolTipOffset = {top: 10, left: 10};

        return (
            <Tabs>
                <Tabs.Panel title='Bar Charts'>
                    <div className='charts'>
                        <section className='chart'>
                            <h1>CPU Chart - Utilization</h1>
                            <BarChart
                                colorScale={colorScale}
                                data={this.state.barDataCPU_Utilization}
                                height={400}
                                width={400}
                                margin={margin}
                                tooltipHtml={barToolTips}
                                tooltipOffset={toolTipOffset}>
                                <span>Child</span>
                            </BarChart>
                        </section>
                        <section className='chart'>
                            <h1>CPU Chart - Interupts</h1>
                            <BarChart
                                colorScale={colorScale}
                                data={this.state.barDataCPU_Interupts}
                                height={400}
                                width={400}
                                margin={margin}
                                tooltipHtml={barToolTips}
                                tooltipOffset={toolTipOffset}>
                                <span>Child</span>
                            </BarChart>
                        </section>
                        <section className='chart last'>
                            <h1>Memory Chart - Percent</h1>
                            <BarChart
                                colorScale={colorScale}
                                data={this.state.barDataMem_Percent}
                                height={400}
                                width={400}
                                margin={margin}
                                tooltipOffset={toolTipOffset}
                                tooltipHtml={barToolTips} />
                        </section>
                    </div>
                </Tabs.Panel>


                <Tabs.Panel title=''>
                    <div className='charts'>

                    </div>
                </Tabs.Panel>

            </Tabs>
        );
    }
}

export default Demo;