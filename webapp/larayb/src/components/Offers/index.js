import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import InfiniteScroll from 'react-infinite-scroller';
import qwest from 'qwest';

const api = {
    baseUrl: 'https://api.soundcloud.com',
    client_id: 'caf73ef1e709f839664ab82bef40fa96'
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 20
  },
  card:{
    textAlign: 'center'
  }
});

class Offers extends Component {

  constructor(props) {
       super(props);

       this.state = {
           tracks: [],
           hasMoreItems: true,
           nextHref: null
       };
   }

  loadItems(page) {
        var self = this;

        var url = api.baseUrl + '/users/8665091/favorites';
        if(this.state.nextHref) {
            url = this.state.nextHref;
        }

        qwest.get(url, {
                client_id: api.client_id,
                linked_partitioning: 1,
                page_size: 10
            }, {
                cache: true
            })
            .then(function(xhr, resp) {
                if(resp) {
                    var tracks = self.state.tracks;
                    resp.collection.map((track) => {
                        if(track.artwork_url == null) {
                            track.artwork_url = track.user.avatar_url;
                        }

                        tracks.push(track);
                        return ""
                    });

                    if(resp.next_href) {
                        self.setState({
                            tracks: tracks,
                            nextHref: resp.next_href
                        });
                    } else {
                        self.setState({
                            hasMoreItems: false
                        });
                    }
                }
            });
    }

  render() {
    const { classes } = this.props;

    const loader = <div className="loader">Loading ...</div>;

    var items = [];
    this.state.tracks.map((track, i) => {
        items.push(
            <Grid item xs={4} className={classes.card}>
                <a href={track.permalink_url} >
                    <img src={track.artwork_url} width="150" height="150" alt="" />
                    <p className="title">{track.title}</p>
                </a>
            </Grid>
        );
        return ""
    });

    return (
      <div className={classes.root}>
        <InfiniteScroll
            pageStart={0}
            loadMore={this.loadItems.bind(this)}
            hasMore={this.state.hasMoreItems}
            loader={loader}>
            <Grid container spacing={24}>
                {items}
            </Grid>
        </InfiniteScroll>
      </div>
    );
  }
}

Offers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Offers);
