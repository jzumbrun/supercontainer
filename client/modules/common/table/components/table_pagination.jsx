import React from 'react'
import { Component } from 'supercapacitor'

class TablePagination extends Component {
  render () {
    var prevUnavailable = this.props.page === 1 ? 'unavailable' : 'available'
    var nextUnavailable = this.props.page >= this.props.pages ? 'unavailable' : 'available'

    return (

      <div className='pagination-centered'>
        <ul className='pagination'>
          <li className={'arrow ' + prevUnavailable}>
            <a href='#' onClick={(e) => this.props.onPageChange(e, 'first')}>«</a>
          </li>
          <li className={'table-button-prev ' + prevUnavailable}>
            <a href='#' onClick={(e) => this.props.onPageChange(e, 'previous')}>&lt;</a>
          </li>
          <li className='table-info unavailable'>
            {this.props.pageInfo}
          </li>
          <li className={'table-button-next ' + nextUnavailable}>
            <a href='#' onClick={(e) => this.props.onPageChange(e, 'next')}>&gt;</a>
          </li>
          <li className={'arrow ' + nextUnavailable}>
            <a href='#' onClick={(e) => this.props.onPageChange(e, 'last')}>»</a>
          </li>
        </ul>
      </div>
    )
  }
}

TablePagination.defaultProps = {
  onPageChange: () => {},
  page: 1,
  pages: 0,
  limit: 0
}

export default TablePagination
