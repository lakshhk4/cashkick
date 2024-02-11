// Modal component
const PurchaseHistoryModal = ({ isOpen, onClose, purchaseHistory }) => {

    console.log(purchaseHistory)

    return (
      // Implement your modal layout here
      <div style={{ display: isOpen ? 'block' : 'none', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '60px', background: '#0F172A', borderRadius: '8px' }} className="flex flex-col">
          <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', background: 'none', border: 'none' }}>Close</button>
          <span className="font-semibold text-2xl">Purchase History</span>
          <span>{`${purchaseHistory.units} units at $${purchaseHistory.cost_per_unit} each`}</span>
        </div>
      </div>
    );
  };

  export default PurchaseHistoryModal