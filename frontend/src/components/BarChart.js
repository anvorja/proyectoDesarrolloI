import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';
Chart.register(...registerables);
<style>
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400&display=swap');
</style>
Chart.defaults.font.family = 'Lexend'
Chart.defaults.font.size = 20
Chart.defaults.font.weight = 900
Chart.defaults.color = "#000080"



const options = {
    fill: true,
    scales: {
  
        x:{
            grid:{
                display:false
            }

        },

        y:{
            ticks: {
                stepSize: 25,
                maxTicksLimit: 10,                               
            },

            grid:{
                display:false
            }
        },
    },
    responsive: true,
    plugins: {
        legend: {
            display: true,
        }
    }
}




export default function BarChart({ejeX, ejeY}){
    const data = {
        datasets: [
            {   
                barPercentage: 0.2,                          
                label: "Consumos anteriores (kWh)",
                data: ejeY,
                borderColor: "rgb(255,177,0)",
                backgroundColor: "rgb(255,177,0)"
            },
            
        ],
        labels: ejeX
        
    }
 return (
    <div className='barchart'>
        <Bar data={data} options={options}/>
    </div>
 )

}