---
sidebar_position: 4
---

# Installing IBM Cloud Pak for Data 4.8.3 and watsonx.ai using Cloud Pak Deployer

This tutorial uses Cloud Pak Deployer to automate the install of the CPD platform (version 4.8.3) and watsonx.ai. The documentation can be found at: <https://ibm.github.io/cloud-pak-deployer/>

## Prerequisites

1. An existing OpenShift cluster with file and block storage and the compute required for IBM Cloud Pak for Data and watsonx.ai.
2. An IBM Entitlement Key: <https://myibm.ibm.com/products-services/containerlibrary>
   1. this is necessary for access to CPD and its cartridges (watsonx.ai)
3. A linux VM with the following:
   1. podman: <https://podman.io/docs/installation>
   2. git: sudo yum install git
   3. OpenShift CLI: <https://docs.openshift.com/container-platform/4.14/cli_reference/openshift_cli/getting-started-cli.html>
4. Install the Node Feature Discovery Operator: <https://docs.nvidia.com/datacenter/cloud-native/openshift/23.9.1/install-nfd.html>
5. Install the GPU Operator: <https://docs.nvidia.com/datacenter/cloud-native/openshift/latest/install-gpu-ocp.html>

## Installation

1. On your Linux VM, pull the code for Cloud Pak Deployer

   ```shell
   git clone --depth=1 https://github.com/IBM/cloud-pak-deployer.git
   ```

2. Change into the `cloud-pak-deployer` directory and build the image (takes roughly 5-10 minutes)

   ```shell
   cd cloud-pak-deployer
   ./cp-deploy.sh build
   ```

3. Once the image is done building, make directories for our cpd configuration files and cpd status files

   ```shell
   mkdir cpd-config

   mkdir cpd-status
   ```

4. Change directories into cpd-config, copy the following yaml config file, and insert your information such as cluster and domain name:

   ```shell
   cd cpd-config
   mkdir config
   cd config
   vi ocp-existing-ocs.yaml
   ```

    ocp-existing-ocs.yaml:

    ```yaml
    ---
    global_config:
      environment_name: techzoneCluster
      cloud_platform: existing-ocp
      env_id: watsonx
      confirm_destroy: False

    openshift:
      - name: techzoneCluster
        ocp_version: 4.14
        cluster_name: techzoneCluster
        domain_name: cloud.techzone.ibm.com
        gpu:
          install: False
        mcg:
          install: False
          storage_type: storage-class
          storage_class: managed-nfs-storage
        openshift_storage:
          - storage_name: ocs-storage
            storage_type: ocs
    # Optional parameters if you want to override the storage class used
    # ocp_storage_class_file: nfs-client
    # ocp_storage_class_block: nfs-client
    ```

5. Copy the second yaml config file into the same directory:

   ```shell
   vi cp4d-483.yaml
   ```

    cp4d-483.yaml:

    ```yaml
    ---
    cp4d:
      - project: cpd
        openshift_cluster_name: techzoneCluster
        cp4d_version: 4.8.3
        cp4d_entitlement: cpd-enterprise
        cp4d_production_license: True
        accept_licenses: False
        sequential_install: False
        db2u_limited_privileges: False
        use_fs_iam: True
        operators_project: cpd-operators
        cartridges:
          - name: cp-foundation
            license_service:
              state: disabled
              threads_per_core: 2

          - name: lite

          - name: scheduler
            state: removed

          #
          # All tested cartridges. To install, change the "state" property to "installed". To uninstall, change the state
          # to "removed" or comment out the entire cartridge. Make sure that the "-" and properties are aligned with the lite
          # cartridge; the "-" is at position 3 and the property starts at position 5.
          #
          # If a cartridge has dependencies and you want to install it, you must ensure that the dependent cartridge is also
          # installed.
          #

          - name: analyticsengine
            description: Analytics Engine Powered by Apache Spark
            size: small
            state: removed

          - name: bigsql
            description: Db2 Big SQL
            state: removed

          - name: ca
            description: Cognos Analytics
            size: small
            instances:
              - name: ca-instance
                metastore_ref: ca-metastore
            state: removed

          - name: dashboard
            description: Cognos Dashboards
            state: removed

          - name: datagate
            description: Db2 Data Gate
            state: removed

          - name: datastage-ent
            description: DataStage Enterprise
            state: removed

          - name: datastage-ent-plus
            description: DataStage Enterprise Plus
            state: removed
            # instances:
            #   - name: ds-instance
            #     # Optional settings
            #     description: "datastage ds-instance"
            #     size: medium
            #     storage_class: efs-nfs-client
            #     storage_size_gb: 60
            #     # Custom Scale options
            #     scale_px_runtime:
            #       replicas: 2
            #       cpu_request: 500m
            #       cpu_limit: 2
            #       memory_request: 2Gi
            #       memory_limit: 4Gi
            #     scale_px_compute:
            #       replicas: 2
            #       cpu_request: 1
            #       cpu_limit: 3
            #       memory_request: 4Gi
            #       memory_limit: 12Gi

          - name: db2
            description: Db2 OLTP
            size: small
            instances:
              - name: ca-metastore
                metadata_size_gb: 20
                data_size_gb: 20
                backup_size_gb: 20
                transactionlog_size_gb: 20
            state: removed

          - name: db2wh
            description: Db2 Warehouse
            state: removed

          - name: dmc
            description: Db2 Data Management Console
            state: removed
            instances:
              - name: data-management-console
                description: Data Management Console
                size: medium
                storage_size_gb: 50

          - name: dods
            description: Decision Optimization
            size: small
            state: removed

          - name: dp
            description: Data Privacy
            size: small
            state: removed

          - name: dpra
            description: Data Privacy Risk Assessment
            state: removed

          - name: dv
            description: Data Virtualization
            size: small
            instances:
              - name: data-virtualization
            state: removed

          # Please note that for EDB Postgress, a secret edb-postgres-license-key must be created in the vault
          # before deploying
          - name: edb_cp4d
            description: EDB Postgres
            state: removed
            instances:
              - name: instance1
                version: "15.4"
                #type: Standard
                #members: 1
                #size_gb: 50
                #resource_request_cpu: 1
                #resource_request_memory: 4Gi
                #resource_limit_cpu: 1
                #resource_limit_memory: 4Gi

          - name: factsheet
            description: AI Factsheets
            size: small
            state: removed

          - name: hadoop
            description: Execution Engine for Apache Hadoop
            size: small
            state: removed

          - name: mantaflow
            description: MANTA Automated Lineage
            size: small
            state: removed

          - name: match360
            description: IBM Match 360
            size: small
            wkc_enabled: true
            state: removed

          - name: openpages
            description: OpenPages
            state: removed

          # For Planning Analytics, the case version is needed due to defect in olm utils
          - name: planning-analytics
            description: Planning Analytics
            state: removed

          - name: replication
            description: Data Replication
            license: IDRC
            size: small
            state: removed

          - name: rstudio
            description: RStudio Server with R 3.6
            size: small
            state: removed

          - name: spss
            description: SPSS Modeler
            state: removed

          - name: syntheticdata
            description: Synthetic Data Generator
            state: removed

          - name: voice-gateway
            description: Voice Gateway
            replicas: 1
            state: removed

          - name: watson-assistant
            description: Watson Assistant
            size: small
            # noobaa_account_secret: noobaa-admin
            # noobaa_cert_secret: noobaa-s3-serving-cert
            state: removed
            instances:
              - name: wa-instance
                description: "Watson Assistant instance"

          - name: watson-discovery
            description: Watson Discovery
            # noobaa_account_secret: noobaa-admin
            # noobaa_cert_secret: noobaa-s3-serving-cert
            state: removed
            instances:
              - name: wd-instance
                description: "Watson Discovery instance"

          - name: watson-ks
            description: Watson Knowledge Studio
            size: small
            # noobaa_account_secret: noobaa-admin
            # noobaa_cert_secret: noobaa-s3-serving-cert
            state: removed

          - name: watson-openscale
            description: Watson OpenScale
            size: small
            state: removed

          - name: watson-speech
            description: Watson Speech (STT and TTS)
            stt_size: xsmall
            tts_size: xsmall
            # noobaa_account_secret: noobaa-admin
            # noobaa_cert_secret: noobaa-s3-serving-cert
            state: removed

          # Please note that for watsonx.ai foundation models, you neeed to install the
          # Node Feature Discovery and NVIDIA GPU operators. You can do so by setting the openshift.gpu.install property to True
          - name: watsonx_ai
            description: watsonx.ai
            state: installed
            models:
              - model_id: google-flan-t5-xxl
                state: removed
              - model_id: google-flan-ul2
                state: removed
              - model_id: eleutherai-gpt-neox-20b
                state: removed
              - model_id: ibm-granite-13b-chat-v1
                state: removed
              - model_id: ibm-granite-13b-instruct-v1
                state: removed
              - model_id: meta-llama-llama-2-70b-chat
                state: removed
              - model_id: ibm-mpt-7b-instruct2
                state: removed
              - model_id: bigscience-mt0-xxl
                state: removed
              - model_id: bigcode-starcoder
                state: removed

          - name: watsonx_data
            description: watsonx.data
            state: removed

          - name: wkc
            description: Watson Knowledge Catalog
            size: small
            state: removed
            installation_options:
              install_wkc_core_only: False
              enableKnowledgeGraph: False
              enableDataQuality: False
              enableFactSheet: False

          - name: wml
            description: Watson Machine Learning
            size: small
            state: installed

          - name: wml-accelerator
            description: Watson Machine Learning Accelerator
            replicas: 1
            size: small
            state: removed

          - name: ws
            description: Watson Studio
            state: installed

          - name: ws-pipelines
            description: Watson Studio Pipelines
            state: removed

          - name: ws-runtimes
            description: Watson Studio Runtimes
            runtimes:
              - ibm-cpd-ws-runtime-py39
              - ibm-cpd-ws-runtime-222-py
              - ibm-cpd-ws-runtime-py39gpu
              - ibm-cpd-ws-runtime-222-pygpu
              - ibm-cpd-ws-runtime-231-pygpu
              - ibm-cpd-ws-runtime-r36
              - ibm-cpd-ws-runtime-222-r
              - ibm-cpd-ws-runtime-231-r
            state: removed

          #
          # Cartridges where extra work is needed (will not install automatically)
          #
          # Product Master requires set up of the Db2 instance secret before install
          - name: productmaster
            description: Product Master
            size: small
            state: removed
    ```

6. Set the environment variables for the newly created directories, IBM Entitlement Key, and cluster login (ensure the login is in double quotes)

   ```shell
   export CONFIG_DIR=<ABSOLUTE_PATH>/cpd-config
   export STATUS_DIR=<ABSOLUTE_PATH>/cpd-status
   export CP_ENTITLEMENT_KEY=<IBM_ENTITLEMENT_KEY>
   export CPD_OC_LOGIN="<YOUR_CLUSTER_LOGIN_COMMAND> --insecure-skip-tls-verify"
   ```

7. Run Cloud Pak Deployer (this will take roughly 1 to 2 hours)

   ```shell
   ./cp-deploy.sh env apply --accept-all-licenses
   ```

8. You can check logs by running:

   ```shell
   ./cp-deploy.sh env logs
   ```
