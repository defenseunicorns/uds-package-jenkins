# 🏪 UDS Jenkins Zarf Package

[<img alt="Made for UDS" src="https://github.com/defenseunicorns/uds-common/blob/main/docs/made-for-uds.svg" height="20px"/>](https://github.com/defenseunicorns/uds-core)
[![Latest Release](https://img.shields.io/github/v/release/defenseunicorns/uds-package-jenkins)](https://github.com/defenseunicorns/uds-package-jenkins/releases)
[![Build Status](https://img.shields.io/github/actions/workflow/status/defenseunicorns/uds-package-jenkins/tag-and-release.yaml)](https://github.com/defenseunicorns/uds-package-jenkins/actions/workflows/tag-and-release.yaml)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/defenseunicorns/uds-package-jenkins/badge)](https://api.securityscorecards.dev/projects/github.com/defenseunicorns/uds-package-jenkins)

This package is designed to be deployed on [UDS Core](https://github.com/defenseunicorns/uds-core), and is based on the upstream [Jenkins](https://github.com/jenkinsci/helm-charts/tree/main/charts/jenkins) chart.

## Pre-requisites

The Jenkins Package expects to be deployed on top of [UDS Core](https://github.com/defenseunicorns/uds-core).

## Flavors

| Flavor    | Description                                            | Example Creation                     |
| --------- | ------------------------------------------------------ | ------------------------------------ |
| upstream  | Uses images from docker.io within the package.         | `zarf package create . -f upstream`  |
| registry1 | Uses images from registry1.dso.mil within the package. | `zarf package create . -f registry1` |
| unicorn   | Uses images from cgr.dev within the package.           | `zarf package create . -f unicorn`   |

> [!IMPORTANT]
> **NOTE #1:** To create the registry1 flavor you will need to be logged into Iron Bank - you can find instructions on how to do this in the [Big Bang Zarf Tutorial](https://docs.zarf.dev/tutorials/6-big-bang/#setup).
> **NOTE #2:** To create the unicorn flavor you will need to be logged into Chainguard.

## Releases

The released packages can be found in [ghcr](https://github.com/defenseunicorns/uds-package-jenkins/pkgs/container/packages%2Fuds%2Fjenkins).

## UDS Tasks (for local dev and CI)

*For local dev, this requires you install [uds-cli](https://github.com/defenseunicorns/uds-cli?tab=readme-ov-file#install)

> [!TIP]
> To get a list of tasks to run you can use `uds run --list`!

## Contributing

Please see the [CONTRIBUTING.md](./CONTRIBUTING.md)
