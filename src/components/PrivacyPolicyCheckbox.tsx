import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DomainLink } from "@/components/DomainLink";
import { useTranslation } from "react-i18next";

interface PrivacyPolicyCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const PrivacyPolicyCheckbox = ({ checked, onCheckedChange }: PrivacyPolicyCheckboxProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-start space-x-2">
      <Checkbox
        id="privacy-policy"
        checked={checked}
        onCheckedChange={(val) => onCheckedChange(val === true)}
        className="mt-0.5"
      />
      <Label htmlFor="privacy-policy" className="text-sm font-normal leading-snug cursor-pointer">
        {t('common.privacyAccept')}{" "}
        <DomainLink to="/privacy-policy" className="text-primary underline hover:text-primary/80" target="_blank">
          {t('common.privacyPolicyLink')}
        </DomainLink>
      </Label>
    </div>
  );
};
