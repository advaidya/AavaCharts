    /** 
    Copyright (c) <2012> <Adityanarayan M Vaidya>
    
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files 
    (the    "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, 
    merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished 
    to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
    FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
    WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    **/
  var COLORS = ["blue", "yellow", "green", "orange", "pink"];
  var PIES = new Object();

  function create_text(id, parent_id) {
    var pt = document.createElementNS("http://www.w3.org/2000/svg",'text');
    pt.setAttribute('id',id);
    document.getElementById(parent_id).appendChild(pt);    
  }

  function create_path(id, parent_id) {  
    var pi = document.createElementNS("http://www.w3.org/2000/svg",'path');
    pi.setAttribute('id',id);
    document.getElementById(parent_id).appendChild(pi);
  }
  
  function create_defs(id, parent_id) {  
    var defs = document.createElementNS("http://www.w3.org/2000/svg",'defs'); 
    defs.setAttribute('id', id);
    document.getElementById(parent_id).appendChild(defs);
  }

  function create_svg(id, parent_id){
    var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    svg.setAttribute('id',id);
    svg.setAttribute('version',"1.1");
    svg.setAttribute('viewBox',"0 0 900 900");
    document.getElementById(parent_id).appendChild(svg);
  }

  function init(id) {
    create_svg("svgchart", id);
    create_defs("pdefs", "svgchart");
    create_path("pi", "pdefs");
    create_path("pe", "pdefs");
    create_text("pt", "pdefs");
  }

  function PieChart (div_id, data) {
    init(div_id);
    this.data = data;
    this.draw = function () {
      drawPieChart(data);
    };
  }

  function expand(evt) {
    var pi = evt.target;
    var pe = document.getElementById("pe" + pi.id.substring(2));

    pi.setAttributeNS(null,"class","internal hide");
    pe.setAttributeNS(null,"class","external show " + PIES[pi.id].color);
  }
 
  function contract(evt) {
    var pe = evt.target;
    var pi = document.getElementById("pi" + pe.id.substring(2));

    pi.setAttributeNS(null,"class","internal show " + PIES[pi.id].color);
    pe.setAttributeNS(null,"class","external hide");
  }

   function config(cx, cy, r) {
     this.cx = cx;
     this.cy = cy;
     this.r = r;
   };	

   function Pie (id, config, q, cq, tq, x1, y1, color) {
      this.id = id;
      this.config = config;
      // Current, Cumulative & Total quantity.
      this.q = q;
      this.cq = cq;
      this.tq = tq;
      
      // Coordinates of the Pie.
      this.x1 = x1;
      this.y1 = y1;
      this.x2;
      this.y2;

      // Angle in degree & radians.
      this.ad;
      this.ar;

      // Arc properties
      this.xaxisrotate = 0;
      this.slarcflag = 0;
      this.sweepflag = 0;

      // Current & Cumulative ratio 
      this.cur_ratio = 0;
      this.cum_ratio = 0;

      this.l_ratio = 0;
      this.ltx = 0;
      this.lty = 0;
      this.lx = 0;
      this.ly = 0;
      this.lar = 0;

      this.color = color;
      
      this.tx = 0;
      this.ty = 0;

      // Path dimension
      this.d = "";

      this.initialize = function () {
        this.cur_ratio = q/tq;
        this.ad = this.cur_ratio * 360;

        if ((0 < this.ad) && (this.ad < 180)) {
          this.slarcflag = 0;
        } else {
          this.slarcflag = 1;
        }

        this.cum_ratio = cq/tq;
        this.ar = (this.cum_ratio * 360 * Math.PI) / 180;
        this.tx = this.config.r * Math.cos(this.ar);
        this.ty = this.config.r * Math.sin(this.ar);

  	this.x2 = parseInt(this.config.cx) + parseInt(this.tx);
        this.y2 = parseInt(this.config.cy) - parseInt(this.ty);

        this.d = "M " + this.config.cx + " " + this.config.cy + " L " + this.x1 + " " + this.y1 + " A " +  this.config.r + "," + this.config.r + " " + this.xaxisrotate + " " + this.slarcflag + "," + this.sweepflag + " " + this.x2 + "," + this.y2 + " z";

        this.l_ratio = this.cum_ratio - ((q/tq)/2);
        this.lar = (this.l_ratio * 360 * Math.PI) / 180;
        this.ltx = (this.config.r - 20) * Math.cos(this.lar);
        this.lty = (this.config.r - 20) * Math.sin(this.lar);

  	this.lx = parseInt(this.config.cx) + parseInt(this.ltx);
        this.ly = parseInt(this.config.cy) - parseInt(this.lty);
      };
      
      this.draw = function () {
        this.initialize();
        return this.d;
      };
    }

  function drawPieChart(data) {
    O = document.getElementById("svgchart");

    var conf_i = new config(200, 150, 100);
    var px_i = conf_i.cx + conf_i.r;
    var py_i = conf_i.cy;

    var conf_e = new config(200, 150, 120);
    var px_e = conf_e.cx + conf_e.r;
    var py_e = conf_e.cy;

    var pq = 0;
    var x;
    var s = "";
    var pi = document.getElementById("pi");	
    var pe = document.getElementById("pe");	
    var pt = document.getElementById("pt");
    
    var total = 0;
    for(var i in data) { total += data[i]; }

    for (x in data) {
      var tpi = pi.cloneNode(false);
      var tpe = pe.cloneNode(false);
      var tpt = pt.cloneNode(false);
      var co = parseInt(x)%COLORS.length;

      var pie_i = new Pie("pi" + x, conf_i, data[x], data[x] + pq, total, px_i, py_i, COLORS[co]);      
      tpi.setAttributeNS(null,"id", pie_i.id);
      tpi.setAttributeNS(null,"d", pie_i.draw());
      tpi.setAttributeNS(null,"class", "internal show " + pie_i.color);
      tpi.onmouseover = function (evt) {
        expand(evt);
      };
      O.appendChild(tpi);
      
      PIES["pi" + x] = pie_i;
      px_i = pie_i.x2;
      py_i = pie_i.y2;
      
      var pie_e = new Pie("pe" + x, conf_e, data[x], data[x] + pq, total, px_e, py_e, COLORS[co]);      
      tpe.setAttributeNS(null,"id", pie_e.id);
      tpe.setAttributeNS(null,"d", pie_e.draw());
      tpe.setAttributeNS(null,"class", "external hide " + pie_e.color);
      tpe.onmouseout = function (evt) {
        contract(evt);
      };
      O.appendChild(tpe);
      
      tpt.setAttributeNS(null,"id", "pt" + x);
      tpt.setAttributeNS(null,"x", pie_i.lx);
      tpt.setAttributeNS(null,"y", pie_i.ly);
      tpt.textContent=pie_i.q; 
      O.appendChild(tpt);
      
      px_e = pie_e.x2;
      py_e = pie_e.y2;

      pq = pq + data[x];
    }
  }
