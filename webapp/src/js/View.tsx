import React, { useEffect, useState } from 'react';
import { Link, useLocation, useOutletContext, useParams } from 'react-router-dom';

import { getbet, Bet } from './lib/sui_tools';
import { ButtonConnect } from './components/ButtonConnect';
import { Fund } from './Fund';
import { Vote } from './Vote';
import { Cancel } from './Cancel';

export function View()
{
    /* Data */

    const [connected, setConnected] = useOutletContext();
    const betId = useParams().uid;
    const [bet, setBet] = useState(undefined);
    const [modalHtml, setModalHtml] = useState(undefined);

    /* Load bet object data */

    const location = useLocation();
    useEffect(() => {
        document.title = `got beef? - View: ${betId}`;
        if (location.state && location.state.bet) {
            // Reuse the bet object data that Find.tsx has already fetched
            setBet(location.state.bet);
        } else {
            // The user came directly to this URL, fetch bet object from Sui
            getbet(betId).then( (bet: Bet|null) => {
                setBet(bet);
            });
        }
    }, []);

    // TODO: when connected, check what action buttons are available to the user

    /* Render */

    if (typeof bet === 'undefined')
        return <React.Fragment>Loading</React.Fragment>;

    if (bet === null)
        return <React.Fragment>Bet not found.</React.Fragment>;

    const actionsHtml = !connected
        ? <ButtonConnect connected={connected} setConnected={setConnected} />
        : <div id='bet-actions'>
            <button type='button' className='nes-btn is-success'
                onClick={() => setModalHtml(<Fund bet={bet} setBet={setBet}/>)}>
                Fund
            </button>
            <button type='button' className='nes-btn is-success'
                onClick={() => setModalHtml(<Vote bet={bet} setBet={setBet}/>)}>
                Vote
            </button>
            <button type='button' className='nes-btn is-error'
                onClick={() => setModalHtml(<Cancel bet={bet} setBet={setBet}/>)}>
                Cancel
            </button>
        </div>;

    const infoHtml = <React.Fragment>
        <h2>{bet.title}</h2>
        <div>
            ID: <a href={'https://explorer.devnet.sui.io/objects/'+betId} className='rainbow' target='_blank'>{betId}</a> <br/>
            {
                !bet.winner.fields.vec ? '' : <React.Fragment>
                    &nbsp;<i className='nes-icon trophy is-small' />: {bet.winner.fields.vec} <br/>
                </React.Fragment>
            }
            Phase: {bet.phase} <br/>
            {
                !bet.description ? '' : <React.Fragment>
                    Deets: {bet.description} <br/>
                </React.Fragment>
            }
            <hr/>
            Bet size: {bet.size} <i className='nes-icon coin is-small' /> {bet.collat_type} <br/>
            Quorum: {bet.quorum}
            <hr/>
            Players: {JSON.stringify(bet.players, null, 2)} <br/>
            Funds: {JSON.stringify(bet.funds.fields.contents, null, 2)} <br/>
            {/*most_votes: {bet.most_votes} <br/>*/}
            <hr/>
            Judges: {JSON.stringify(bet.judges, null, 2)} <br/>
            Votes: {JSON.stringify(bet.votes.fields.contents, null, 2)} <br/>
        </div>
    </React.Fragment>;

    return <React.Fragment>
        <section className='showcase'>
            <section className='nes-container with-title'>
                <h3 className='title'>Actions</h3>
                <div id='bet-actions'>
                    { actionsHtml }
                </div>
            </section>
        </section>
        <br/>
        { modalHtml }
        { infoHtml }
    </React.Fragment>;

}
