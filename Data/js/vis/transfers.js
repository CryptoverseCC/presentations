(function (name) {

  let accounts = {
    "0x123": "10GNT\n100SNT\n20ZRX",
    "0x456": "5GNT\n\n100ZRX",
    "0x789": "3GNT\n100SNT\n30ZRX",
    "0xabc": "10SNT\n20ZRX",
    "0xdef": "10ETH\n10SNT\n5ZRX",
    "0xghi": "20ETH\n7ZRX",
    "0xjkl": "10GNT\n20DGD",
    "0xmno": "60GNT\n30DGD\n20ZRX",
  };

  let transfers = [
    "0x123 10GNT 0x456",
    "0x456 5ZRX 0xabc",
    "0xmno 7DGD 0xdef",
    "0x123 4GNT 0xjkl",
    "0xdef 20ZRX 0x456",
    "0xghi 30SNT 0xmno",
    "0xghi 5GNT 0xdef",
    "0xjkl 20ETH 0xmno",
    "0x789 10ETH 0xmno",
    "0x456 2ETH 0x123",
  ];

  nodes = [];

  for (let account in accounts) {
    nodes.push({
      data:{ 
        id: account, 
        size: 80, 
        label: account + '\n\n' + accounts[account], 
        bgcolor: '#00BFFF'
      }
    });
  }

  edges = []

  for (let transfer of transfers) {
    let [frm, label, to] = transfer.split(' ');
    nodes.push({
      data:{ 
        id: frm+to, 
        size: 40, 
        label: label, 
        bgcolor: '#87CEEB'
      }
    });
    edges.push({
      data:{ 
        source: frm,
        target: frm+to, 
        label: 'from',
        bgcolor: '#D3D3D3',
      }
    });
    edges.push({
      data:{ 
        source: frm+to,
        target: to, 
        label: 'to',
        bgcolor: '#D3D3D3'
      }
    });
  }


  let cy = cytoscape({
    container: document.querySelector('.'+name+' .graph'),
    elements: {
      nodes: nodes,
      edges: edges
    },
    layout: {
      name: 'cose-bilkent',
      directed: true,
      animate: false
    },
    style: cytoscape.stylesheet()
      .selector('node')
        .css({
          'height': 'data(size)',
          'width': 'data(size)',
          'background-color': 'data(bgcolor)',
          'label': 'data(label)',
          'text-valign': 'center',
          'text-align': 'right',
          'text-wrap': 'wrap',
          'font-size': '10px',
        })
      .selector('edge')
        .css({
          'curve-style': 'bezier',
          'width': 1,
          'label': 'data(label)',
          'target-arrow-shape': 'triangle',
          'font-size': '10px',
          'background-color': 'data(bgcolor)',
        })
  });

  document.querySelector('.' + name + ' button.export').addEventListener('click', () => {
    var png64 = cy.png();  
    var w=window.open('about:blank','image from canvas');
    w.document.write("<img src='"+png64+"' alt='from canvas'/>");
  })
  

})('transfers');