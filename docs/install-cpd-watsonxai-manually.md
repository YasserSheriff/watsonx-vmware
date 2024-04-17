# Installing IBM Cloud Pak for Data 4.8.3 and watsonx.ai using CPD-CLI

This tutorial uses the cpd-cli to manually install the IBM Cloud Pak for Data platform (version 4.8.3) and watsonx.ai. The documentation can be found at: <https://www.ibm.com/docs/en/cloud-paks/cp-data/4.8.x?topic=data-installing-cloud-pak>.

## Prerequisites

1. An existing OpenShift cluster with file and block storage and the compute required for IBM Cloud Pak for Data and watsonx.ai.
2. An IBM Entitlement Key: <https://myibm.ibm.com/products-services/containerlibrary>
   1. this is necessary for access to CPD and its cartridges (watsonx.ai)
3. A linux VM with the following:
   1. podman: <https://podman.io/docs/installation>
   2. OpenShift CLI: <https://docs.openshift.com/container-platform/4.14/cli_reference/openshift_cli/getting-started-cli.html>
4. Install the Node Feature Discovery Operator: <https://docs.nvidia.com/datacenter/cloud-native/openshift/23.9.1/install-nfd.html>
5. Install the GPU Operator: <https://docs.nvidia.com/datacenter/cloud-native/openshift/latest/install-gpu-ocp.html>

## Installation

1. On your Linux VM, create a directory for the cpd-cli and change directories into it

   ```shell
   mkdir cpd
   cd cpd
   ```

2. Install the latest version of the cpd-cli and navigate to the downloaded directory

   ```shell
   curl -LSo cpd-cli-linux-EE-13.tgz https://github.com/IBM/cpd-cli/releases/download/v13.1.3/cpd-cli-linux-EE-13.1.3.tgz

   tar -xf cpd-cli-linux-EE-13.tgz
   ```

3. Login to the public cloud pak registry

   ```shell
   podman login cp.icr.io -u cp -p <IBM_PUBLIC_ENTITLEMENT_KEY>
   ```

4. Spin up the olm-utils container, login to your cluster with cpd-cli, and add your entitlement key to the global pull secret

    **Note:** When logging into your cluster with cpd-cli, leave out the "oc login" portion of the login command

   ```shell
   ./cpd-cli manage restart-container

   ./cpd-cli manage login-to-ocp <YOUR_OC_LOGIN_COMMAND>

   ./cpd-cli manage add-cred-to-global-pull-secret --registry=cp.icr.io --registry_pull_user=cp --registry_pull_password=<YOUR_IBM_PUBLIC_ENTITLEMENT_KEY>
   ```

5. Install the cpd platform

    ``` shell
    ./cpd-cli manage apply-cluster-components --release=4.8.3 --license_acceptance=true

    ./cpd-cli manage apply-scheduler \
    --release=4.8.3 \
    --license_acceptance=true \
    --scheduler_ns=ibm-cpd-scheduler

    ./cpd-cli manage authorize-instance-topology --cpd_operator_ns=cpd-operator --cpd_instance_ns=cpd

    ./cpd-cli manage setup-instance-topology \
    --release=4.8.3 \
    --cpd_operator_ns=cpd-operator \
    --cpd_instance_ns=cpd \
    --license_acceptance=true \
    --block_storage_class=<YOUR_BLOCK_STORAGE_CLASS_NAME>

    # cpd platform install
    ./cpd-cli manage apply-olm --components=cpd_platform  --release=4.8.3 --cpd_operator_ns=cpd-operator

    ./cpd-cli manage apply-cr --components=cpd_platform --release=4.8.3 --license_acceptance=true --cpd_operator_ns=cpd-operator --cpd_instance_ns=cpd --block_storage_class=<YOUR_BLOCK_STORAGE_CLASS_NAME> --file_storage_class=<YOUR_FILE_STORAGE_CLASS_NAME> --license_acceptance=true
    ```

6. Install the watsonx.ai component

    ``` shell
    ./cpd-cli manage apply-olm --components=watsonx_ai  --release=4.8.3 --cpd_operator_ns=cpd-operator

    ./cpd-cli manage apply-cr --components=watsonx_ai --release=4.8.3 --license_acceptance=true --cpd_instance_ns=cpd --block_storage_class=<YOUR_BLOCK_STORAGE_CLASS_NAME> --file_storage_class=<YOUR_FILE_STORAGE_CLASS_NAME>  --license_acceptance=true

    ```
