window.addEventListener(`click`, (e)=>{


            PLOT = document.getElementById("plot");
            var x1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            var y1 = [1, 3, 5, 8, 10, 12, 15, 16, 20, 34];

            // Create a new array that contains only unique values
            var uniqueY1 = Array.from(new Set(y1));

            // Sort the x-axis values
            x1.sort();

            var trace = {
                x: x1,
                y: uniqueY1,
                autobinx: false,
                histnorm: "count",
                marker: {
                    color: "rgba(255, 242, 0, 1)",
                    line: {
                        color: "rgba(255, 100, 102, 1)",
                        width: 0.5
                    }
                },
                opacity: 0.5,
                type: "histogram",
                xbins: null
            };

            var data = [trace];

            var layout = {
                bargap: 0.05,
                bargroupgap: 0.2,
                barmode: "group",

                title: {
                    text: "DAILY TOTAL LIKE COUNT",
                    font: {
                        family: "Arial, Helvetica, sans-serif",
                        size: 30,
                        color: "rgb(130, 130, 198)"
                    },
                },


                xaxis: {
                    title: {
                        text: "Days",
                        font: {
                            family: "Times New Roman",
                            size: 20,
                            color: "rgba(245, 191, 39, 0.8)"
                        }
                    },
                },

                yaxis: {
                    title: {
                        text: "Total Likes",
                        font: {
                            family: "Times New Roman",
                            size: 20,
                            color: "rgba(245, 191, 39, 0.8)"
                        }
                    }
                }
            };
            Plotly.newPlot("plot", data, layout);
        })