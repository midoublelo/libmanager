<script lang="ts">
    import { FileDropzone } from "@skeletonlabs/skeleton";

    let upload: FileList;
    //console.log(upload);
</script>

<div>
    <FileDropzone name="uploads" accept=".csv,.txt" bind:upload/>
</div>