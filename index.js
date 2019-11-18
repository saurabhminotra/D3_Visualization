/**Structure / Steps performed*/
//get_anchor_details(); //Get the anchor points based upon number of attributes
//plot_anchors(anchors); //plot the anchor points based on the coordinates passed from get anchor details
//drawlabel(anchors) ;    //place the text next to anchors 
//get_data_points(final_anchors); // get the data_points based on the calculation
//plot_data_points(store);        //plot the data points 
//get_new_data_points //        pass the updated anchor list to get the list of new data points
//plot_data_points_new // plot the data points based upon the new anchor positions

///Reference in the readme.txt file

const canvas = d3.select(".canva");
//canvas wrapped into d3 object

const margin = { top: 50, right: 50, bottom: 70, left: 200 };

var width = 800;
var height = 900;

//add svg element to add things to canvas
const svg = canvas.append("svg")
  .attr('width', width)
  .attr('height', height);
const graphWidth = 1024 - margin.left - margin.right;
const graphHeight = 1024 - margin.top - margin.bottom;

//Main canvas    //Udemy [1]   [13] [14]
const mainCanvas = svg.append("g")
  .attr("width", graphWidth / 2)
  .attr("height", graphHeight / 2)
  .attr("transform", `translate(${margin.left + 200}, ${margin.top + 300})`);

var radius = 250;
var size = 720;
var cx = 250;
var cy = 250;
var anchor_list = [];//column names
var anchor_data = [];
//Define ordinal scale //ref Udemy[1] [11]
const colorScale = d3.scaleOrdinal(d3["schemeSet2"])

const anchors = [];
const final_anchors = {}
//
//[4] Get the file name user has selected
function myFunction() {
  var fileName = document.getElementById("mySelect").value;
  plot_outer_circle();
  getcsv(fileName);
  createSlider();
}
function plot_outer_circle() {
  const circle = svg.append("circle")
    .attr("cx", radius)
    .attr("cy", radius)
    .attr("r", radius)
    .attr("fill-opacity", 0)
    .style("stroke", "Red");
};

//ref [3][4][5] from d3indepth for .property elements
function createSlider() {
  d3.select("#opacitycontainer").style("display", "block");
  var sliderVal = document.getElementById("opRange").value;
  var output = document.getElementById("op");
  output.innerHTML = sliderVal + "(%)";
  d3.select("#opRange").on("input", function () {
    svg.selectAll('.dotpoints')
      .transition()
      .duration(100)
      .style("opacity", d3.select("#opRange").property("value") / 100);
    output.innerHTML = d3.select("#opRange").property("value") + "(%)";
  });
}

//Define Tooltip//Udemy[1]//chapter 27
var div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0.7)
var drag_;

//load the file from the folder
function getcsv(fileName) {
  d3.csv(fileName, function (d) {
    return d;
  }).then(function (data) {
    anchor_list = data.columns;
    anchor_length = data.columns.length;
    var classColumn_name = anchor_list[anchor_length - 1];

    //[8]Read the delimeter separated file and store it in anchor data
    var dsv = d3.dsvFormat(";");
    d3.text(fileName).then(function (text) {
      var anchor_data = dsv.parse(text);
      //[2]to find out angle, x, y coordinates, depending upon list of attributes
      function get_anchor_details() {
        const AnchorDetails =
          anchor_list.slice(0, anchor_list.length - 1).map(function (d, i = i) {
            x = cx + (radius) * Math.cos(i * 2 * Math.PI / (anchor_length - 1));
            y = cy + (radius) * Math.sin(i * 2 * Math.PI / (anchor_length - 1));
            //[2] //class slide
            label = anchor_list[i];
            //method 1 color //ref udemy[1]
            colorScale.domain(data.map(d => d.classColumn))
            anchors.push({ x: x, y: y, label: label }) //[10]
            final_anchors[label] = [x, y]
            return {
              x: x,
              y: y,
              label: label,
              anchors
            };
          }
          );
      };

      get_anchor_details(); //Get the anchor points based upon number of attributes
      plot_anchors(anchors); //plot the anchor points based on the coordinates passed from get anchor details
      drawlabel(anchors);    //place the text next to anchors 
      var store = [];
      get_data_points(final_anchors); // get the data_points based on the calculation
      plot_data_points(store);        //plot the data points 

      /*-------Start function   get the data_points based on the calculation */

      function get_data_points(anchors) {
        var AnchorData =
          anchor_data.map(function (d, i) {
            var classColumn_name = anchor_list[anchor_length - 1];
            label = anchor_list[i - 1];
            var column_names = Object.keys(d); //[12]
            var sum_row = 0;
            var sum_ax = 0;
            var sum_ay = 0;
            var Vx = 0;
            var Vy = 0;
            var j = 0;
            var classColumn_val;

            //each time we will have some value, where we are mapping
            var objRow = "";

            var separator = "";
            for (column of column_names) {
              if (isNaN(d[column]) || column == classColumn_name) {
              }
              else {

                objRow += separator + column + " : " + d[column]
                separator = "  <br> <br>"
                //normalize [15]
                const b = d3.scaleLinear()
                  .domain([0, d3.max(anchor_data, d => d[column])]) ///lowest and highest value
                  .range([0, 1]);
                classColumn_val = d[column];
                var n = b(d[column]);
                var Ax = anchors[column][0] * n;
                var Ay = anchors[column][1] * n;
                sum_ax += Ax;
                sum_ay += Ay;
                sum_row += n;
              }
              ++j;
            }
            Vx = (sum_ax) / (sum_row);
            Vy = (sum_ay) / (sum_row);
            store.push({                                           //[10]
              objRow: objRow,
              Vx: Vx, Vy: Vy, n: n, classColumn_name: column
              , classColumn_val: classColumn_val
            });

            return { store: { store: store } }
          })
        return 1
      }
      /*//----- End function get_data_points*/

      /**----Start------------Get New Data points-----------------------------*/

      function get_new_data_points(anchors) {
        var AnchorData =
          anchor_data.map(function (d, i) {
            var classColumn_name = anchor_list[anchor_length - 1];
            label = anchor_list[i - 1];
            var column_names = Object.keys(d);
            var sum_row = 0;
            var sum_ax = 0;
            var sum_ay = 0;
            var Vx = 0;
            var Vy = 0;
            var j = 0;
            var classColumn_val;
            //each time we will have some value, where we are mapping
            var objRow = "";
            var separator = "";
            for (column of column_names) {
              if (isNaN(d[column]) || column == classColumn_name) {
              }
              else {
                objRow += separator + column + " : " + d[column]
                separator = "  <br> <br>"
                //normalize
                const b = d3.scaleLinear()
                  .domain([0, d3.max(anchor_data, d => d[column])]) //17
                  .range([0, 1]);
                var classColumn_name = anchor_list[anchor_length - 1];
                classColumn_val = d[column];
                var n = b(d[column]);
                var Ax = anchors[column][0] * n;
                var Ay = anchors[column][1] * n;
                sum_ax += Ax;
                sum_ay += Ay;
                sum_row += n;
              }
              ++j;
            }
            Vx = (sum_ax) / (sum_row);
            Vy = (sum_ay) / (sum_row);
            store.push({
              objRow: objRow,
              Vx: Vx, Vy: Vy, n: n, classColumn_name: column
              , classColumn_val: classColumn_val
            });
            return { store }
          })
        return store
      }// End get_data_points
      /**----End------------Get New Data points-----------------------------*/

      /**----Start------------drawlabel-----------------------------*/
      //drawlabel // Place the text next to the anchor points
      //udemy [1] , 
      function drawlabel(anchors) {
        //  d3.selectAll(".labels").remove();
        var g = svg.selectAll()
          .data(anchors)
          .enter()
        g.append("text")  //[9]
          .attr("class", "labels")
          .text(function (d) { return d.label; })
          .attr("x", function (d) { ; return (d.x) + 10; })
          .attr("y", function (d) { ; return (d.y) + 20; })
          .attr("id", function (d) { return d.label; })
          .attr("font-family", "sans-serif")
          .attr("font-size", "15px")
          .attr("font-weight", "bold")
          .attr("fill", "Black");
      }
      //draw label end
      /**----Start------------drawlabel-----------------------------*/

      /*------Start - plot_anchors - plot the anchor points */
      var g;
      function plot_anchors(anchors) {
        d3.selectAll("g").remove();
        d3.selectAll("anchors").remove();
        var g = svg.selectAll()
          .data(anchors)
          .enter()
        g.append("circle") //[1]
          .attr("class", "anchors")
          .attr("id", function (d) { ; return d.label; })
          .attr("cx", function (d) { ; return d.x; })
          .attr("cy", function (d) { ; return d.y; })
          .attr("r", 10)
          .attr("fill", d => colorScale(d.classColumn))
          .on("mouseover", function (d, i, n) //adding event mouseover [1]
          {
            d3.select(n[i])
              .transition()       //transition for each element //reference Udemy[]
              .duration(100)     //transistion gonna long for 100milli seconds
              .style("opacity", 0.8)//opacity 1 is visible/ 0 not visible
              .attr("stroke", "Grey")
              .attr("stroke-width", "5px")
              .attr("fill", d => colorScale(d.classColumn))
            div.transition()
              .duration(600)
              .style("opacity", 0.9)
              ;
            //reference learning center
            div.html("<p> Anchor Name: " + d.label + "<br> <br>" + "Position <br>" + "X:" + d.x + "<br> <br>Y:" + d.y + "</p> ")
              .style("left", (d3.event.pageX) + "px")//pageX gives where is the event happening
              .style("top", (d3.event.pageY) + "px")//place of tooltip

          }
          )
          .on("mouseout", function (d, i, n) //adding event mouseover
          {
            d3.select(n[i])
              .transition()       //transition for each element
              .duration(100)     //transistion gonna long for 100milli seconds
              .style("opacity", 1)//opacity 1 is visible/ 0 not visible
              .attr("stroke", "")
              .attr("fill", d => colorScale(d.classColumn))
            div.transition()
              .duration(500)
              .style("opacity", 0)
          }
          )
          // 
          .call(d3.drag()// [16]the refernce is taken to understand and implement the drag functionality
            .on('start', function () { console.log("drag") })
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended)

          )
        //https://stackoverflow.com/questions/47401647/add-label-text-to-d3-circles

      } //plot_anchors
      /*------End - plot_anchors - plot the anchor points */

      function dragstarted(d) { //[16]
        d3.select(this).raise().classed('active', true);

      }

      function dragended(d) { //[16]
        d3.select(this).classed('active', false);
        d3.select(this).attr('stroke-width', 0);
      }

      newAngle_Flag = 'N';
      function dragged(d, i) { //[16]
        d3.select(this).raise().classed('active', true);
        let tempx = d3.event.x - radius;
        let tempy = d3.event.y - radius;
        let newAngle = Math.atan2(tempy, tempx);
        newAngle = newAngle < 0 ? 2 * Math.PI + newAngle : newAngle;
        d.theta = newAngle;
        d.x = radius + Math.cos(newAngle) * radius;
        d.y = radius + Math.sin(newAngle) * radius;
        d3.select(this).attr('cx', d.x).attr('cy', d.y);
        // var label = d.label.replace(/\s/g, '');

        d3.select("text#" + d.label)
          .attr('x', ((d.x) + 20))
          .attr('y', ((d.y) + 20))
          .attr("font-family", "sans-serif")
          .attr("font-size", "15px")
          .attr("fill", "Black")
          .attr("font-weight", "bold");

        x = d.x;
        y = d.y;
        anchors_new = [];
        anchors_new.push({ x: x, y: y })
        final_anchors[d.label] = [x, y]
        store = [];
        store = get_new_data_points(final_anchors);
        plot_data_points_new(store);

      } return {

      }
      /*---Start ----plot_data_points_new */
      /*Update Data Points*/

      var d;
      function plot_data_points_new(store) {
        d3.selectAll(".dotpoints").remove();
        d3.selectAll("g").remove();

        var d = svg.selectAll()
          .data(store)
          .enter()
          .append("g")
        d.append("circle")
          .attr("class", "dotpoints")
          .attr("cx", function (d) { ; return (d.Vx) + 5; })
          .attr("cy", function (d) { ; return (d.Vy) + 5; })
          .attr("r", 3)
          //  .attr("fill", "Black")
          .attr("fill", d => colorScale(d.classColumn_val)) // method 1
          .on("mouseover", function (d, i, n) //adding event mouseover
          {
            d3.select(n[i])
              .transition()       //transition for each element
              .duration(100)     //transistion gonna long for 100milli seconds
              .style("opacity", 1)//opacity 1 is visible/ 0 not visible
              .attr('r', 15)
              .attr("stroke", "Purple") //to hightlight a point // ref https://github.com/WYanChao/RadViz
              .attr("stroke-width", "5px")
            div.transition()
              .duration(200)
              .style("opacity", 0.8);
            div.html("<p>" + d.objRow + "<p>" + "</p")
              .style("left", (d3.event.pageX) + "px")//pageX gives where is the event happening
              .style("top", (d3.event.pageY) + "px")//place of tooltip

          }
          )
          .on("mouseout", function (d, i, n) //adding event mouseover
          {
            d3.select(n[i])
              .transition()       //transition for each element
              .duration(100)     //transistion gonna long for 100milli seconds
              .style("opacity", 1)//opacity 1 is visible/ 0 not visible
              .attr('r', 3)
              .attr("stroke", "")
            div.transition()
              .duration(500)
              .style("opacity", 0)
          }
          )
      }//data_points

      /*---End ----plot_data_points_new */

      /**----------------plot data points-----------------------------*/
      var d;
      function plot_data_points(store) {
        d3.selectAll(".dotpoints").remove();
        d3.selectAll("g").remove();

        var d = svg.selectAll()
          .data(store)
          .enter()
          .append("g")
        d.append("circle")
          .attr("class", "dotpoints")
          .attr("cx", function (d) { ; return d.Vx; })
          .attr("cy", function (d) { ; return d.Vy; })
          .attr("r", 3)
          //  .attr("fill", "Black")
          .attr("fill", d => colorScale(d.classColumn_val)) // method 1
          .on("mouseover", function (d, i, n) //adding event mouseover
          {
            d3.select(n[i])
              .transition()       //transition for each element
              .duration(100)     //transistion gonna long for 100milli seconds
              .style("opacity", 1)//opacity 1 is visible/ 0 not visible
              .attr('r', 15)
              .attr("stroke", "Purple") //to hightlight a point // ref https://github.com/WYanChao/RadViz
              .attr("stroke-width", "5px")
            div.transition()
              .duration(200)
              .style("opacity", 0.8);
            //checkcheck
            div.html("<p>" + d.objRow + "<p>" + "</p")
              .style("left", (d3.event.pageX) + "px")//pageX gives where is the event happening
              .style("top", (d3.event.pageY) + "px")//place of tooltip
          }
          )
          .on("mouseout", function (d, i, n) //adding event mouseover
          {
            d3.select(n[i])
              .transition()       //transition for each element
              .duration(100)     //transistion gonna long for 100milli seconds
              .style("opacity", 1)//opacity 1 is visible/ 0 not visible
              .attr('r', 3)
              .attr("stroke", "")
            div.transition()
              .duration(500)
              .style("opacity", 0)
          }
          )

      }//data_points

    });
  })
}
