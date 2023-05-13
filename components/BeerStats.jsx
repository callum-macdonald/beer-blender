export default function BeerStats({ beerColor, abv, srm, ibu, statsRef }) {


    return (
      <div ref={statsRef} className="statsContainer">
        <div className="leftItem">
          <svg xmlns="http://www.w3.org/2000/svg" width="110" height="200">
            <g transform="scale(0.3)">
              <rect x="41.9167" y="87.9553" width="316" height="500.7088" style={{ fill: { beerColor } }} />
              <rect x="68" y="118" width="284" height="430" fill={beerColor} />
              <path d="M105,110q9 -40,225 10v50q-120 20,-450 -15Zq-90 -40,-225 0v-50q120 20,280 2Z" fill="#FFFFFF" stroke="#3D414A" strokeWidth="6" />
              <path d="M0,0V606.5771H398V0H0ZM289.3819,510.2375C258.8333,537.1666,131,537.1666,104.5554,510.0182L67.9448,119.2761c0-2.6406,12.3885-5.681,131.0552-5.681,102.0736,0,131.5215,3.4049,131.5215,5.681Z" style={{ fill: '#fff' }} />
              <path d="M106.1667,512.011c36.3333,22.989,135.9081,26.6777,182.8707,0L285.3333,546C253.5,574.5,143.25,578,108.6785,546Z" style={{ fill: '#eee' }} />
              <path d="M287.6667,511.2773c-28.7987,24.056-150.9984,26.6107-181.5,0" style={{ fill: 'none', stroke: '#3d414a', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '6px' }} />
              <path d="M67.9448,119.2761l39.8773,425.6074c22.9279,32.1166,152.5112,31.45,177.9141,0l44.7853-425.6074c0-2.2761-29.4479-5.681-131.5215-5.681C80.3333,113.5951,67.9448,116.6355,67.9448,119.2761Z" style={{ fill: 'none', stroke: '#3d414a', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '12px' }} />
            </g>
          </svg>
        </div>

        <div className="rightItem">
          <p>ABV: {abv}%</p>
          <p>SRM: {srm}</p>
          <p>IBU: {ibu}</p>
        </div>
      </div>
    );
  };