(function (name) {

  let accounts = {
    '0x123': '10GNT\n100SNT\n20ZRX',
    '0x456': '5GNT\n\n100ZRX',
  };

  let transfers = [
    '0x123 10GNT 0x456',
    '0x456 2ETH 0x123',
  ];

  let claims = [
    {
      context: 'ehereum',
      author: '0x123',
      claim: {
        target: 'http://userfeeds.io/',
        title: 'Userfeeds',
        summary: 'Userfeeds Platform',
      },
      types: ['link'],
      credits: [
        {
          type: 'Interface',
          value: 'http://rinkeby.etherscan.io/'
        }
      ]
    },
    {
      context: 'ethereum:bentyncoin',
      author: '0x123',
      claim: {
        target: 'http://some.url/path',
        title: 'Some Page',
        summary: 'Page with awesome content',
      },
      types: ['link'],
      credits: [
        {
          type: 'Interface',
          value: 'http://blog.some.url/path'
        }
      ]
    }
  ]

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

  hashCode = function(s){
    return s.split('').reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
  }

  for (let claim of claims) {
    let claimId = 'claim' + claims.indexOf(claim);

    nodes.push({
      data: {
        id: claim.context,
        size: 80, 
        label: 'Context\n' + claim.context, 
        bgcolor: 'lightgray'
      }
    });

    nodes.push({
      data: {
        id: claim.claim.target,
        size: 80, 
        label: 'Target\n' + claim.claim.target, 
        bgcolor: '#FFD700'
      }
    });

    for (let ctype of claim.types) {
      nodes.push({
        data: {
          id: ctype,
          size: 80, 
          label: 'Type: '+ctype, 
          bgcolor: 'yellow'
        }
      });
      edges.push({
        data:{ 
          source: ctype,
          target: claimId,
          label: '',
          bgcolor: '#D3D3D3'
        }
      });
    }

    for (let credit of claim.credits) {
      nodes.push({
        data: {
          id: credit.value,
          size: 80, 
          label: credit.type + '\n' + credit.value, 
          bgcolor: 'lightyellow'
        }
      });
      edges.push({
        data:{ 
          source: claimId,
          target: credit.value,
          label: 'created using',
          bgcolor: '#D3D3D3'
        }
      });
    }
    
    nodes.push({
      data: {
        id: claimId,
        size: 60, 
        label: 'Claim',
        bgcolor: '#90EE90'
      }
    });

    edges.push({
      data:{ 
        source: claimId,
        target: claim.context,
        label: 'intended for',
        bgcolor: '#D3D3D3'
      }
    });

    edges.push({
      data:{ 
        source: claim.author,
        target: claimId,
        label: 'authored',
        bgcolor: '#D3D3D3'
      }
    });

    edges.push({
      data:{ 
        source: claimId,
        target: claim.claim.target,
        label: 'Title: ' + claim.claim.title+'\n'+'Summary: '+claim.claim.summary,
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
          'text-wrap': 'wrap',
          'background-color': 'data(bgcolor)',
        })
  });

  document.querySelector('.' + name + ' button.export').addEventListener('click', () => {
    var png64 = cy.png();  
    var w=window.open('about:blank','image from canvas');
    w.document.write('<img src='+png64+' alt="from canvas"/>');
  })
  

})('claims-full');