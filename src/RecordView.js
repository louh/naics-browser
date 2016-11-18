import React from 'react'
import { Link } from 'react-router'
import reactStringReplace from 'react-string-replace'
import { parseCrossrefs } from './record-helpers'

class RecordView extends React.Component {
  render () {
    const record = this.props.record

    // Parse record and insert HTML
    if (record.crossrefs) {
      record.crossrefs = parseCrossrefs(record.crossrefs, record)
    }

    return (
      <div>
        <div id="record">
          <div className="naics-view">
            <div className="crumbs">
              <span className="naics-year">{record.year} NAICS</span>
              <span className="naics-level level2">
                Sector {record.twoDigit.code} &ndash; {record.twoDigit.title}
              </span>
            </div>

            <h2>
              <span className="naics-code">{record.code}</span>
              &nbsp;
              <span className="naics-title">{record.title}</span>
            </h2>

            {(() => {
              if (typeof record.trilateral !== 'undefined' && record.trilateral === 1) {
                return (
                  <p className="note">
                    Canadian, Mexican, and United States industries are comparable. <a href="#">Learn more</a>
                  </p>
                )
              }
            })()}

            {(() => {
              if (typeof record.description !== 'undefined') {
                if (typeof record.description_code !== 'undefined') {
                  return (
                    <div className="naics-description">
                      <p>
                        <a href={`?year=${record.year}&code=${record.description_code}`} className="naics-link" data-year={record.year} data-code={record.description_code}>{record.description[0]}</a>
                      </p>
                    </div>
                  )
                } else {
                  return (
                    <div className="naics-description">
                      {record.description.map((paragraph, index) => {
                        // Make 'The Sector as a Whole' on top-level NAICS into a subtitle
                        if (record.code.toString().length === 2) {
                          if (paragraph === 'The Sector as a Whole') {
                            return <h3 key={index}>The Sector as a Whole</h3>
                          }
                        }

                        return <p key={index}>{paragraph}</p>
                      })}
                    </div>
                  )
                }
              }
            })()}

            {(() => {
              if (typeof record.examples !== 'undefined') {
                return (
                  <div className="naics-examples">
                    <h3>Illustrative examples</h3>

                    <ul>
                      {record.examples.map((item, index) => {
                        return <li key={index}>{item}</li>
                      })}
                    </ul>
                  </div>
                )
              }
            })()}

            {(() => {
              if (typeof record.crossrefs !== 'undefined') {
                let multipleCrossrefsIntro = ''
                if (record.crossrefs.length > 1) {
                  multipleCrossrefsIntro = <p>Establishments primarily engaged in&mdash;</p>
                }

                return (
                  <div className="naics-crossrefs">
                    <h3>Cross references</h3>
                    {multipleCrossrefsIntro}
                    <ul>
                      {record.crossrefs.map((item, index) => {
                        // a crossref `item` is an object with two properties:
                        // `code` and `text`. `text` will be parsed to include
                        // links by replacing text with react-router <Link>s
                        // `reactStringReplace` runs for every match, which
                        // creates a bunch of problems, so only produce one
                        // captured group.
                        /*
                          Notes:
                          Preceding the code # may be words like 'Industry', 'Industry Group',
                          'U.S. Industry', 'Subsector', or 'Sector'
                          After the code # is the title, terminated by a semicolon or period.
                          Use this to figure out the actual length of the link text.
                        */
                        const regexp = new RegExp('((?:(?:(?:U.S. )?Industry(?: Group)?)|(?:(?:Subs|S)ector))\\s+' + item.code + '.+(?=[.;]))', 'g')
                        return (
                          <li key={index}>
                            {reactStringReplace(item.text, regexp, (match, i) => (
                              <Link key={i} to={{ query: { year: record.year, code: item.code } }}>
                                {match}
                              </Link>
                            ))}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              }
            })()}

            {/* DISABLED */}
            {(() => {
              if (typeof record.conversions !== 'undefined') {
                return (
                  <div className="naics-conversions">
                    <h3>Index entries</h3>

                    <table>
                      <thead>
                        <tr>
                          <td>2002 NAICS</td>
                          <td>2007 NAICS</td>
                          <td>2012 NAICS</td>
                          <td>Corresponding Index Entries</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>541512</td>
                          <td>541512</td>
                          <td>541512</td>
                          <td>CAD (computer-aided design) systems integration design services</td>
                        </tr>
                        <tr>
                          <td>541512</td>
                          <td>541512</td>
                          <td>541512</td>
                          <td>CAE (computer-aided engineering) systems integration design services</td>
                        </tr>
                        <tr>
                          <td>541512</td>
                          <td>541512</td>
                          <td>541512</td>
                          <td>CAM (computer-aided manufacturing) systems integration design services</td>
                        </tr>
                        <tr>
                          <td>541512</td>
                          <td>541512</td>
                          <td>541512</td>
                          <td>Computer hardware consulting services or consultants</td>
                        </tr>
                        <tr>
                          <td>541512</td>
                          <td>541512</td>
                          <td>541512</td>
                          <td>Computer software consulting services or consultants</td>
                        </tr>
                        <tr>
                          <td>541512</td>
                          <td>541512</td>
                          <td>541512</td>
                          <td>Computer systems integration analysis and design services</td>
                        </tr>
                        <tr>
                          <td>541512</td>
                          <td>541512</td>
                          <td>541512</td>
                          <td>Computer systems integration design consulting services</td>
                        </tr>
                        <tr>
                          <td>541512</td>
                          <td>541512</td>
                          <td>541512</td>
                          <td>Computer systems integrator services</td>
                        </tr>
                        <tr>
                          <td>541512</td>
                          <td>541512</td>
                          <td>541512</td>
                          <td>Computer-aided design (CAD) systems integration design services</td>
                        </tr>
                        <tr>
                          <td>541512</td>
                          <td>541512</td>
                          <td>541512</td>
                          <td>Computer-aided engineering (CAE) systems integration design services</td>
                        </tr>
                        <tr>
                          <td>541512</td>
                          <td>541512</td>
                          <td>541512</td>
                          <td>Computer-aided manufacturing (CAM) systems integration design services</td>
                        </tr>
                        <tr>
                          <td>541512</td>
                          <td>541512</td>
                          <td>541512</td>
                          <td>Information management computer systems integration design services</td>
                        </tr>
                        <tr>
                          <td>541512</td>
                          <td>541512</td>
                          <td>541512</td>
                          <td>Local area network (LAN) computer systems integration design services</td>
                        </tr>
                        <tr>
                          <td>541512</td>
                          <td>541512</td>
                          <td>541512</td>
                          <td>Network systems integration design services, computer</td>
                        </tr>
                        <tr>
                          <td>541512</td>
                          <td>541512</td>
                          <td>541512</td>
                          <td>Office automation computer systems integration design services</td>
                        </tr>
                        <tr>
                          <td>541512</td>
                          <td>541512</td>
                          <td>541512</td>
                          <td>Systems integration design consulting services, computer</td>
                        </tr>
                        <tr>
                          <td>541512</td>
                          <td>541512</td>
                          <td>541512</td>
                          <td>Systems integration design services, computer</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )
              }
            })()}
          </div>
        </div>

        <div className="link">
          <div className="link-json">
            <a href={`http://naics.codeforamerica.org/v0/q?year=${record.year}&code=${record.code}`}>
              View this data as JSON.
            </a>
            &nbsp;
            <a href={`http://www.census.gov/cgi-bin/sssd/naics/naicsrch?code=${record.code}&search=${record.year}%20NAICS%20Search`}>
              View on Census website.
            </a>
          </div>
        </div>
      </div>
    )
  }
}

RecordView.propTypes = {
  record: React.PropTypes.object
}

export default RecordView
