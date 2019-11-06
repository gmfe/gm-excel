import React from 'react'
import { configure, addDecorator, addParameters } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { withKnobs } from '@storybook/addon-knobs'

const reqs = [
  require.context('../src', true, /stories\.js$/)
]

function loadStories() {
  reqs.forEach(req => {
    req.keys().forEach(filename => req(filename))
  })
}

addParameters({
  options: {
    panelPosition: 'right'
  }
})

addDecorator(
  withInfo({
    inline: true,
    header: false,
    styles: stylesheet => {
      return {
        ...stylesheet,
        infoBody: {
          ...stylesheet.infoBody,
          padding: '10px',
          fontWeight: 'normal'
        },
        source: {
          ...stylesheet.source,
          marginBottom: '10px'
        }
      }
    }
  })
)

addDecorator(withKnobs)

configure(loadStories, module)
