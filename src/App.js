import React, { Component } from 'react';
// import styled from 'styled-components';
import axios from 'axios';
import logo from './imatrix.png'
require('dotenv').config()

class App extends Component {
    state={
      input:'',
      data: {
        publicSearch: {
          results: '',
          available: null,
          show:false
        },
        godaddyAccount: {
          results: '',
          available: null,
          show:false
        },
        enomAccount:{
          results: '',
          available: null,
          show:false
        },
        whoIs:{
          results: '',
          available: null,
          show:false
        }
      },
      whoIsRecord:'',
      error:{
        message:'',
        exist:null,
        show:false
    }
  }

  resetData = () =>{
    this.setState({
      data: {
        publicSearch: {
          results: '',
          available: null,
          show:false
        },
        godaddyAccount: {
          results: '',
          available: null,
          show:false
        },
        enomAccount:{
          results: '',
          available: null,
          show:false
        },
        whoIs:{
          results: '',
          available: null,
          show:false
        }
      },
      error:{
        message:'',
        exist:null,
        show:false
    }
    })
  }

  handleInput = (e) => {
    this.setState({
      input: e.target.value
    })
  }

  deleteInput = () =>{
    return this.setState({
      input:''
    })
  }

  checkAvailable = () => {
    let domain = this.state.input

    this.resetData()
    return axios.get(`http://localhost:4000/check/${domain}`)
    .then((res) => {
      return this.setState((prevState)=>{
        return {
          data:{
            enomAccount:prevState.data.enomAccount,
            whoIs:prevState.data.whoIs,
            godaddyAccount:prevState.data.godaddyAccount,
            publicSearch: {
              results: res.data,
              available: res.data.available,
              show:true
            }
          }
        }
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  checkWhoIs = () => {
    let domain = this.state.input
    this.resetData()
    return axios.get(`http://localhost:4000/whois/${domain}`)
    .then((res) => {
      let missingData
      if(res.data.WhoisRecord.dataError === 'MISSING_WHOIS_DATA'){
        missingData = false
      }else{
        missingData = true
      }
      this.setState((prevState) => {
        return {
          data:{
            enomAccount:prevState.data.enomAccount,
            publicSearch:prevState.data.publicSearch,
            godaddyAccount:prevState.data.godaddyAccount,
            whoIs: {
              results:res.data,
              show:true,
              available:missingData
            }
          },
          error:{
            message:res.data.WhoisRecord.registryData.header,
            exist:prevState.exist
          }
        }
      })
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  checkGodaddy = () => {
    let domain = this.state.input
    this.resetData()
    return axios.get(`http://localhost:4000/godaddy/${domain}`)
    .then((res) => {
      if(res.data.code !== 'NOT_FOUND'){
        return this.setState((prevState)=>{
          return {
            data:{
              publicSearch:prevState.data.publicSearch,
              enomAccount:prevState.data.enomAccount,
              whoIs:prevState.data.whoIs,
              godaddyAccount: {
                results:res.data,
                available:true,
                show:true
              }
            }
          }
        })
      } else{
        return this.setState((prevState)=>{
          return {
            data:{
              publicSearch:prevState.data.publicSearch,
              enomAccount:prevState.data.enomAccount,
              whoIs:prevState.data.whoIs,
              godaddyAccount: {
                available: false,
                show:true
              }
            },
            error:{
              message: res.data.message,
              exist: false
            }
          }
        })
      }
    })
    .catch((err) => {
      console.log(err)
    })
  }

  checkEnom = () => {
    let domain = this.state.input
    this.resetData()
    return axios.get(`http://localhost:4000/enom/${domain}`)
    .then((res)=>{
      if('IP_NOT_REGISTERED' === res.data){
        this.setState({
          error:{
            message:'Unregistered IP - Add IP to eNom account to make API Requests',
            show:true
          }
        })
      }else if(res.data === 'DOMAIN_NOT_FOUND'){
        return this.setState((prevState)=>{
          return {
            data:{
              publicSearch:prevState.data.publicSearch,
              godaddyAccount:prevState.data.godaddyAccount,
              whoIs:prevState.data.whoIs,
              enomAccount: {
                available: false,
                show:true,
                results:res.data
              }
            }
          }
        })
      }else if(res.data === 'NOT_BELONGS_TO_ACCOUNT'){
        return this.setState((prevState)=>{
          return {
            data:{
              publicSearch:prevState.data.publicSearch,
              godaddyAccount:prevState.data.godaddyAccount,
              whoIs:prevState.data.whoIs,
              enomAccount: {
                available: false,
                show:true,
                results:res.data
              }
            }
          }
        })
      }else{
        return this.setState((prevState)=>{
          return {
            data:{
              publicSearch:prevState.data.publicSearch,
              godaddyAccount:prevState.data.godaddyAccount,
              whoIs:prevState.data.whoIs,
              enomAccount: {
                available: true,
                show:true,
                results:res.data
              }
            }
          }
        })
      }
    })
    .catch((err)=>{
      console.log(err)
    })
  }
  
  render() {
    return (
        <div className="container">
          <div className="row">
            <img src={logo} alt="company logo"/>
            <nav id='seachbar' style={{backgroundColor:'#fff',margin: '10px 0'}}>
              <div className="nav-wrapper">
                <div className="input-field">
                  <input id="search" type="search" required  onChange={this.handleInput} value={this.state.input}></input>
                  <label className="label-icon" htmlFor="search"><i className="material-icons">search</i></label>
                  <i onClick={this.deleteInput} className="material-icons">close</i> 
                </div>
              </div>
            </nav>
            <button className="col s2 waves-effect waves-light btn-small" style={{ backgroundColor:'#349ac9', margin:'0 2px'}} onClick={this.checkAvailable}>Available</button>
            <button className="col s2 waves-effect waves-light btn-small" style={{ backgroundColor:'#349ac9', margin:'0 2px 0 0'}} onClick={this.checkWhoIs}>Who.is</button>
            <button className="col s2 waves-effect waves-light btn-small" style={{ backgroundColor:'#349ac9', margin:'0 2px'}} onClick={this.checkGodaddy}>GoDaddy</button>
            <button className="col s2 waves-effect waves-light btn-small" style={{ backgroundColor:'#349ac9', margin:'0 2px'}} onClick={this.checkEnom}>eNom</button>
            <button className="col s2 waves-effect waves-light btn-small" style={{ backgroundColor:'#349ac9', margin:'0 0 0'}} disabled title='Not Available'>Register.com</button>
          </div>
          <div className="row">

            {/* Public Domain Search card START */}
            <div className="col s12 card" style={ !this.state.data.publicSearch.show ? {display:'none'}:{display:'unset', height:'300px'}} >
              <div className="card-image waves-effect waves-block waves-light"></div>
              <div className="card-content">
              {
              this.state.data.publicSearch.available
              ?<div>
                <span className="card-title activator grey-text text-darken-4">AVAILABLE<i className="material-icons right">more_vert</i></span>
                <p>{this.state.data.publicSearch.results.domain}</p>
              </div>
              :<div>
                <span className="card-title activator grey-text text-darken-4">NOT AVAILABLE<i className="material-icons right">more_vert</i></span>
                <p>{this.state.data.publicSearch.results.domain}</p>
              </div>
              }
              </div>
              <div className="card-reveal">
              {
              this.state.data.publicSearch.available
              ?<div>
                <span className="card-title grey-text text-darken-4">AVAILABLE<i className="material-icons right">close</i></span>
                <p>This domain is not owned and available for purchase</p>
              </div>
              :<div>
                <span className="card-title grey-text text-darken-4">NOT AVAILABLE<i className="material-icons right">close</i></span>
                <p>It looks like this domain has already been purchaced. Check the Whois Information or if we manage it under our eNom or GoDaddy Accounts.</p>
              </div>
              }
              </div>
            </div>
            {/* Public Domain Search card END */}

            {/* GoDaddy Account Search card START */}
            <div className="col s12 card" style={ this.state.data.godaddyAccount.show ? {display:'unset', height:'300px'}:{display:'none'}} >
              <div className="card-image waves-effect waves-block waves-light"></div>
              <div className="card-content">
              {
              this.state.data.godaddyAccount.available
              ?<div>
                <span className="card-title activator grey-text text-darken-4">iMatrix Manages Domain<i className="material-icons right">more_vert</i></span>
                <p>{this.state.data.godaddyAccount.results.domain}</p>
              </div>
              :<div>
                <span className="card-title activator grey-text text-darken-4">Not managed under iMatrix's GoDaddy Account<i className="material-icons right">more_vert</i></span>
                {/* <p>{this.state.data.godaddyAccount.results.domain}</p> */}
              </div>
              }
              </div>
              <div className="card-reveal">
              {
              this.state.data.godaddyAccount.available
              ?<div>
                <span className="card-title grey-text text-darken-4">Domain Information<i className="material-icons right">close</i></span>
                <ul>
                  <li>Status: {this.state.data.godaddyAccount.results.status}</li>
                  <li>Created: {this.state.data.godaddyAccount.results.createdAt}</li>
                  <li>Expires: {this.state.data.godaddyAccount.results.expires}</li>
                  <li>Renewal Deadline: {this.state.data.godaddyAccount.results.renewDeadline}</li>
                  <li>Transfer Away Eligible: {this.state.data.godaddyAccount.results.transferAwayEligibleAt}</li>
                  <li>NameServers: {this.state.data.godaddyAccount.results.nameServers[0]}, {this.state.data.godaddyAccount.results.nameServers[0]}</li>
                </ul>
              </div>
              :<div>
                <span className="card-title grey-text text-darken-4">NOT AVAILABLE<i className="material-icons right">close</i></span>
                <p>This domain is not managed under our GoDaddy account. Check our enom account, if you have already done so request Tier 2 Support check our Register.com Account</p>
              </div>
              }
              </div>
            </div>
            {/* GoDaddy Account Search card END */}

            {/* Whois info Search card START */}
            <div className="col s12 card" style={ this.state.data.whoIs.show ? {display:'unset', height:'300px'}:{display:'none'}} >
              <div className="card-image waves-effect waves-block waves-light">
              </div>
              <div className="card-content">
              {
              this.state.data.whoIs.available
              ?<div>
                <span className="card-title activator grey-text text-darken-4">WhoIs Info<i className="material-icons right">more_vert</i></span>
                <ul>
                  <li>Registrar Name: {this.state.data.whoIs.results.WhoisRecord.registryData.registrarName}</li>
                  <li>NameServers: {this.state.data.whoIs.results.WhoisRecord.registryData.nameServers.hostNames[0]}, {this.state.data.whoIs.results.WhoisRecord.registryData.nameServers.hostNames[1]}</li>
                  <li>Status: {this.state.data.whoIs.results.WhoisRecord.registryData.status}</li>
                </ul>
              </div>
              :<div>
                <span className="card-title activator grey-text text-darken-4"><i className="material-icons right">more_vert</i></span>
                <p>WHO IS INFORMATION UNAVAILABLE</p>
              </div>
              }
              </div>
              <div className="card-reveal">
              {
              this.state.data.whoIs.available
              ?<div>
                <span className="card-title grey-text text-darken-4">Domain Information<i className="material-icons right">close</i></span>
              </div>
              :<div>
                <span className="card-title grey-text text-darken-4">MISSING WHOIS INFO<i className="material-icons right">close</i></span>
                <p>{this.state.error.message}</p>
              </div>
              }
              </div>
            </div>
            {/* Whois info Search card END */}

            {/* eNoM account IP ADDRESS ERROR START */}
            <div className="col s12 card" style={ this.state.error.show ? {display:'unset', height:'300px'}:{display:'none'}} >
              <div className="card-image waves-effect waves-block waves-light">
              </div>
              <div className="card-content">
                <span className="card-title activator grey-text text-darken-4">IP Address is not whitelisted - Check with Tier2 Support or IT Support</span>
              </div>
            </div>
            {/* eNoM account IP ADDRESS ERROR END */}

            {/* eNoM account Search card START */}
            <div className="col s12 card" style={ this.state.data.enomAccount.show ? {display:'unset', height:'300px'}:{display:'none'}} >
              <div className="card-image waves-effect waves-block waves-light">
              </div>
              <div className="card-content">
              {
              this.state.data.enomAccount.available
              ?<div>
                <span className="card-title activator grey-text text-darken-4">iMatrix Manages Domain<i className="material-icons right">more_vert</i></span>
              </div>
              :<div>
                <span className="card-title activator grey-text text-darken-4">Not managed under iMatrix's eNom Account<i className="material-icons right">more_vert</i></span>
              </div>
              }
              </div>
              <div className="card-reveal">
              {
              this.state.data.enomAccount.available
              ?<div>
                <span className="card-title grey-text text-darken-4">Domain Information<i className="material-icons right">close</i></span>
                <ul>
                  <li>Nameservers: {this.state.data.enomAccount.results.dns[0]}, {this.state.data.enomAccount.results.dns[1]}</li>
                  <li>Expires: {this.state.data.enomAccount.results.expiration[0]}</li>
                  <li></li>
                </ul>
              </div>
              :<div>
                <span className="card-title grey-text text-darken-4">NOT AVAILABLE<i className="material-icons right">close</i></span>
                <p>This domain is not managed under our eNom account. Check our GoDaddy account, if you have already done so request Tier 2 Support check our Register.com Account </p>
              </div>
              }
              </div>
            </div>
            {/* eNoM account Search card END */}

          </div>
          <footer className="page-footer"style={{backgroundColor:'rgba(52, 154, 201)', top:'700px'}}>
            <div className="container">
              <div className="row">
                <div className="col l6 s12">
                  <h5 className="white-text"></h5>
                  <p className="grey-text text-lighten-4">This Multi Registrar Domain Search Tool was created 
                  by Miguel Arvizu. Please feel free to leave your feedback on my Github regarding this project. 
                  If you have any suggestions or tips, I'd liked to hear you thoughts. Thanks!</p>
                </div>
                <div className="col l4 offset-l2 s12">
                  <h5 className="white-text">Links</h5>
                  <ul>
                    <li><a className="grey-text text-lighten-3" href="https://www.linkedin.com/in/miguelarvizudev/">LinkedIn</a></li>
                    <li><a className="grey-text text-lighten-3" href="https://github.com/marvizusd">GitHub</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="footer-copyright">
              <div className="container">
              Created by Miguel Arvizu
              </div>
            </div>
          </footer>
        </div>
    );
  }
}

export default App;