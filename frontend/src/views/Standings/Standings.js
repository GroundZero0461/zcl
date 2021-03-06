import React from 'react'
import ReactTable from "react-table";
import axios from 'axios'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

const styles = {
    cardIconTitle: {
      ...cardTitle,
      marginTop: "15px",
      marginBottom: "0px"
    }
  };
const useStyles = makeStyles(styles);

async function getLeagues() {
    const response = await axios.get('/api/leagues')
    return response.data
}
async function getStandings(leagueId, seasonId) {
    let params = `?league=${leagueId}`
    if (seasonId !== -1) {
        params += `&season=${seasonId}`
    }
    const url = `/api/standings${params}`
    const response = await axios.get(url)
    return response.data
}

function filterCaseInsensitive(filter, row) {
	const id = filter.pivotId || filter.id;
	return (
		row[id] !== undefined ?
			String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
		:
			true
	);
}
function getSeason(leagueData, leagueId) {
    for (const item of leagueData) {
        if (item.id === leagueId) {
            return item.seasons
        }
   
    }
    return []
}
export default function Standings() {
    const history = useHistory()
    const classes = useStyles();
    const [data, setData] = React.useState([])
    const [leagueData, setLeagueData] = React.useState([])
    const [seasonData, setSeasonData] = React.useState([])
    const [league, setLeague] = React.useState(null)
    const [season, setSeason] = React.useState(null)
    const [loading, setLoading] = React.useState(true)

    const changeLeague = (event) => {
        const seasons = getSeason(leagueData, event.target.value)
        const idxLastSeason = seasons.length - 1
        let seasonId
        if (idxLastSeason !== -1) {
            seasonId = seasons[idxLastSeason].id
            setSeason(seasonId)
        } else {
            seasonId = -1
            
        }
        setSeason(seasonId)
        setLeague(event.target.value)
        setSeasonData(seasons)
        setLoading(true)
        getStandings(event.target.value, seasonId).then(res => {
            setData(res)
            setLoading(false)
        })
    }
    const changeSeason = (event) => {
        setSeason(event.target.value)
        setLoading(true)
        getStandings(league, event.target.value).then(res => {
            setData(res)
            setLoading(false)
        }) 
    }
    React.useEffect(() => {
        if (leagueData.length === 0) {
            getLeagues().then(res => {
                setLoading(true)
                const leagueId = res[0].id
                const idxLastSeason = res[0].seasons.length -1
                const seasonId = res[0].seasons[idxLastSeason].id
                if (res.length < 1) { return }
                setLeagueData(res)
                setLeague(leagueId)
                setSeasonData(res[0].seasons)   
                setSeason(seasonId)
                getStandings(leagueId, seasonId).then(res => {
                    setData(res)
                    setLoading(false)
                })
            }).catch(err => setLeagueData([]))
        }
        if ((typeof league === 'number') && (typeof season === 'number')) {
            getStandings(league, season).then(res => setData(res))
        }
        

    }, [])
    const leagueSelect = () => {
        return (
            <>
            <Select id='leagueDropDown' value={league||-1} onChange={changeLeague}>
                {leagueData.map((item, idx) => {
                    return <MenuItem key={idx} value={item.id}>{item.name}</MenuItem>
                })}
            </Select>
            </>
        )
 
    }
    const seasonSelect = () => {
        return (
            <>
            <Select id='seasonDropDown' value={season||-1} onChange={changeSeason}>
                <MenuItem key={-1} value={-1}>All Time</MenuItem>
                {seasonData.map((item, idx) => {
                    return <MenuItem key={idx} value={item.id}>{item.name}</MenuItem>
                })}
            </Select>
            </>
        )
 
    }
    const rank = (r) => {
        if (r <= 5) {
            return <h5>{r}</h5>
        }
        return r
    }
    const addRowClick = (state, row) => {
        if (row && row.row) {
          const item = data[row.index]
          return {
            onClick: (e) => {
              const target = `/portal/profile/${item.id}`
              history.push(target)
            }
          }
        }
        return {}
      }
    return (<>
        <div>
            

    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary" icon>
            <CardIcon color="danger">
              LS
            </CardIcon>
            <h4 className={classes.cardIconTitle}>League Standings</h4>
          </CardHeader>
          <CardBody>
          <div> {leagueSelect()}</div>
            <div> {seasonSelect()}</div>

            <ReactTable
              defaultFilterMethod={filterCaseInsensitive}
              data={data}
              loading={loading}
              columns={[
                {
                    Header: "Rank",
                    id: "rank",
                    accessor: d => rank(d.rank)
                },
                {
                    Header: "Player",
                    accessor: "name",
                  },
                {
                    Header: "ADJ W/R %",
                    id: "adjusted_win_rate",
                    accessor: d => parseFloat(d.adjusted_win_rate.toFixed(2))
                },
                {
                    Header: "Games",
                    accessor: "total_matches"
                },
                {
                    Header: "W",
                    accessor: "total_wins"
                },
                {
                    Header: "L",
                    accessor: "total_losses"
                },
                {
                    Header: "D",
                    accessor: "total_draws"
                },
                {
                    Header: "Act W/R %",
                    id: "win_rate",
                    accessor: d => parseFloat(d.win_rate.toFixed(2)) 
                },
                {
                    Header: "W/R MOD",
                    id: "rate",
                    accessor: d => parseFloat(d.rate.toFixed(2))
                },
             


               
              ]}
            
              showPaginationTop
              showPaginationBottom={false}
              className="-striped -highlight"
              getTrProps={(state, rowInfo) => addRowClick(state, rowInfo)}
            />
            </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
            
        </div>
    </>)
}
