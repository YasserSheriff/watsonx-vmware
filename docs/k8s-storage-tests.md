---
sidebar_position: 2
---

# Storage Validation Tool for IBM Cloud Paks

This tutorial uses ansible playbooks to validate file and block storage for Cloud Pak for Data and its services: <https://github.com/IBM/k8s-storage-tests>.

## Running the Tests

1. Login to your OpenShift cluster

2. Run the following commands to upgrade your Python (3.6+)
   1. If you are not root, prefix the commands with `sudo`

   ```shell
   yum update -y
   yum install -y python3
   ```

3. Run the following command to upgrade pip:

   ```shell
   dnf install python3-pip
   ```

4. If you are using Python3, create a symlink between Python and Python3:

   ```shell
   ln -s -f /usr/bin/python3 /usr/bin/python
   ```

5. If you are using pip3, create a symlink between pip adn pip3, then upgrade pip:

   ```shell
   ln -s -f /usr/bin/pip3 /usr/bin/pip
   python -m pip install --upgrade pip
   ```

6. Install Ansible:

   ```shell
   pip install ansible==2.10.5
   ```

7. Install the Python client for OpenShift

   ```shell
   pip install openshift
   ```

8. If you run into a PyYAML error in the previous step, run the following commands:

   ```shell
   rm -rf /usr/lib64/python3.6/site-packages/yaml
   rm -f /usr/lib64/python3.6/site-packages/PyYAML-*
   pip install openshift
   ```

9. Install Ansible dependencies:

   ```shell
   ansible-galaxy collection install operator_sdk.util
   ansible-galaxy collection install kubernetes.core
   ```

10. Install git if not already installed and clone the repository with the required storage tests:

    ```shell
    dnf install git
    git clone https://github.com/IBM/k8s-storage-tests.git
    ```

11. Create a new project for our test:

    ```shell
    oc new-project storage-test
    ```

12. Navigate to your params.yml file within the repo:

    ```shell
    cd k8s-storage-tests/
    vi params.yml
    ```

13. The current params.yaml only supports login by token, therefore fill out the "ocp_url" and "ocp_token" fields, and leave the "ocp_username" and "ocp_password" fields as "required"

    ```shell
    ocp_url: https://<YOUR_HOST>:<YOUR_PORT>
    ocp_username: <required>
    ocp_password: <required>
    ocp_token: <YOUR_OCP_TOKEN>
    ```

14. Additionally within the params.yml file, edit the information for your file and block storage class names, as well as the namespace you created in step 11

    ```shell
    storageClass_ReadWriteOnce: <YOUR_BLOCK_STORAGE_NAME>
    storageClass_ReadWriteMany: <YOUR_FILE_STORAGE_NAME>
    storage_validation_namespace: storage-test
    ```

15. Run the playbook to start the test:

    ```shell
    ansible-playbook main.yml --extra-vars "@./params.yml" | tee output.log
    ```
