export default function isUpdateAvailable(approval) {
    return (approval && approval.present && approval.status === "asked"
        && approval.update_automatically && approval.plan && approval.plan.length);
}
