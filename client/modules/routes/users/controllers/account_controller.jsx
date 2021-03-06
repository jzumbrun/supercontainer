import React from 'react'
import { Component } from 'supercapacitor'
import UserStore from '../stores/user_store'
import FormLib from '../../../lib/form'

class Account extends Component {
  constructor (props) {
    super(props)

    this.state = {
      form: {
        firstName: UserStore.current.firstName,
        lastName: UserStore.current.lastName,
        email: UserStore.current.email,
        password: UserStore.current.password
      }
    }
  }

  /**
    * Handle Sign Up
    */
  handleSubmit (e) {
    e.preventDefault()
    UserStore.update(this.state.form)
  }

  render () {
    return (
      <div className='container'>
        <div className='page-header'>
          <h1>Account</h1>
        </div>
        <form className='margin-bottom-lg'>

          <legend>Name</legend>

          <div className='row'>
            <div className='col-lg-6 margin-bottom-md'>
              <label htmlFor='firstName'>First Name</label>
              <input type='text' value={this.state.form.firstName} className='form-control' onChange={FormLib.handleChange(this, 'firstName')} />
            </div>
            <div className='col-lg-6 margin-bottom-md'>
              <label htmlFor='lastName'>Last Name</label>
              <input type='text' value={this.state.form.lastName} className='form-control' onChange={FormLib.handleChange(this, 'lastName')} />
            </div>
          </div>

          <legend>Security</legend>

          <div className='row'>
            <div className='col-lg-6 margin-bottom-md'>
              <label htmlFor='email'>Email Address</label>
              <input type='text' value={this.state.form.email} className='form-control' onChange={FormLib.handleChange(this, 'email')} />
            </div>
            <div className='col-lg-6 margin-bottom-md'>
              <label htmlFor='password'>Password</label>
              <input type='password' className='form-control' placeholder='Leave blank to keep current password' onChange={FormLib.handleChange(this, 'password')} />
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-12 margin-top-md'>
              <button type='submit' className='btn btn-primary' onClick={this.handleSubmit.bind(this)}>GO</button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default Account
